/**
 * Sync Queue for offline mutations
 *
 * This module provides a queue system for tracking operations that need to be
 * synced when the application comes back online. Uses Dexie for atomic operations
 * and BroadcastChannel for cross-tab coordination.
 */

import { db } from '@/db/db'
import type { SyncOperation } from '@/types'

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 5000 // 5 seconds base delay
const SYNC_LOCK_NAME = 'soundcheck-sync-lock'
const SYNC_CHANNEL_NAME = 'soundcheck-sync-channel'

// BroadcastChannel for cross-tab communication
let syncChannel: BroadcastChannel | null = null

if (typeof BroadcastChannel !== 'undefined') {
  syncChannel = new BroadcastChannel(SYNC_CHANNEL_NAME)
}

/**
 * Get all pending sync operations
 */
export const getSyncQueue = async (): Promise<SyncOperation[]> => {
  try {
    return await db.syncQueue
      .where('status')
      .equals('pending')
      .or('status')
      .equals('failed')
      .sortBy('timestamp')
  } catch (error) {
    console.error('Error loading sync queue:', error)
    return []
  }
}

/**
 * Add an operation to the sync queue with atomic transaction
 */
export const addToSyncQueue = async (
  operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount' | 'status' | 'nextAttemptAt'>
): Promise<void> => {
  try {
    await db.transaction('rw', db.syncQueue, async () => {
      const newOperation: SyncOperation = {
        ...operation,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        retryCount: 0,
        status: 'pending',
        nextAttemptAt: Date.now(),
      }

      await db.syncQueue.add(newOperation)

      // Notify other tabs of new operation
      syncChannel?.postMessage({ type: 'queue-updated', count: await getSyncQueueCount() })
    })
  } catch (error) {
    console.error('Error adding to sync queue:', error)
    throw error
  }
}

/**
 * Remove an operation from the sync queue
 */
export const removeFromSyncQueue = async (operationId: string): Promise<void> => {
  try {
    await db.transaction('rw', db.syncQueue, async () => {
      await db.syncQueue.delete(operationId)

      // Notify other tabs
      syncChannel?.postMessage({ type: 'queue-updated', count: await getSyncQueueCount() })
    })
  } catch (error) {
    console.error('Error removing from sync queue:', error)
    throw error
  }
}

/**
 * Update an operation's retry count, status, and error with exponential backoff
 */
export const updateSyncOperation = async (
  operationId: string,
  error?: string
): Promise<void> => {
  try {
    await db.transaction('rw', db.syncQueue, async () => {
      const operation = await db.syncQueue.get(operationId)
      if (!operation) return

      const newRetryCount = operation.retryCount + 1
      const nextAttemptDelay = RETRY_DELAY_MS * Math.pow(2, newRetryCount - 1) // Exponential backoff

      await db.syncQueue.update(operationId, {
        retryCount: newRetryCount,
        status: newRetryCount >= MAX_RETRIES ? 'failed' : 'pending',
        lastError: error,
        nextAttemptAt: Date.now() + nextAttemptDelay,
      })

      // Notify other tabs
      syncChannel?.postMessage({ type: 'queue-updated', count: await getSyncQueueCount() })
    })
  } catch (dbError) {
    console.error('Error updating sync operation:', dbError)
    throw dbError
  }
}

/**
 * Get count of pending operations
 */
export const getSyncQueueCount = async (): Promise<number> => {
  try {
    return await db.syncQueue
      .where('status')
      .anyOf(['pending', 'failed'])
      .count()
  } catch (error) {
    console.error('Error getting sync queue count:', error)
    return 0
  }
}

/**
 * Clear all sync operations
 */
export const clearSyncQueue = async (): Promise<void> => {
  try {
    await db.transaction('rw', db.syncQueue, async () => {
      await db.syncQueue.clear()

      // Notify other tabs
      syncChannel?.postMessage({ type: 'queue-updated', count: 0 })
    })
  } catch (error) {
    console.error('Error clearing sync queue:', error)
    throw error
  }
}

/**
 * Process sync queue with tab coordination via navigator.locks
 * Only one tab will process the queue at a time
 */
export const processSyncQueue = async (): Promise<void> => {
  // Use navigator.locks for tab coordination if available
  if (typeof navigator !== 'undefined' && 'locks' in navigator) {
    try {
      await navigator.locks.request(
        SYNC_LOCK_NAME,
        { mode: 'exclusive', ifAvailable: true },
        async (lock) => {
          if (!lock) {
            console.log('Another tab is already processing sync queue')
            return
          }

          await processSyncQueueInternal()
        }
      )
    } catch (error) {
      console.error('Error acquiring sync lock:', error)
      // Fallback to processing without lock
      await processSyncQueueInternal()
    }
  } else {
    // Fallback for browsers without navigator.locks
    await processSyncQueueInternal()
  }
}

/**
 * Internal sync queue processing logic
 */
async function processSyncQueueInternal(): Promise<void> {
  try {
    const queue = await db.syncQueue
      .where('status')
      .equals('pending')
      .and((op) => op.nextAttemptAt <= Date.now())
      .sortBy('timestamp')

    for (const operation of queue) {
      if (operation.retryCount >= MAX_RETRIES) {
        console.warn(`Operation ${operation.id} exceeded max retries, marking as failed`)
        await db.syncQueue.update(operation.id, { status: 'failed' })
        continue
      }

      try {
        // Mark as processing
        await db.syncQueue.update(operation.id, { status: 'processing' })

        // TODO: Implement actual sync logic when cloud backend is ready
        // For now, this is a placeholder that simulates sync
        console.log('Processing sync operation:', operation)

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Remove successful operation from queue
        await removeFromSyncQueue(operation.id)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error(`Error syncing operation ${operation.id}:`, error)
        await updateSyncOperation(operation.id, errorMessage)
      }
    }

    // Notify other tabs of completion
    syncChannel?.postMessage({ type: 'sync-completed', count: await getSyncQueueCount() })
  } catch (error) {
    console.error('Error processing sync queue:', error)
    throw error
  }
}

/**
 * Listen for sync queue updates from other tabs
 */
export const onSyncQueueUpdate = (callback: (count: number) => void): (() => void) => {
  if (!syncChannel) {
    return () => {} // No-op cleanup function
  }

  const handler = (event: MessageEvent) => {
    if (event.data.type === 'queue-updated' || event.data.type === 'sync-completed') {
      callback(event.data.count)
    }
  }

  syncChannel.addEventListener('message', handler)

  return () => {
    syncChannel?.removeEventListener('message', handler)
  }
}
