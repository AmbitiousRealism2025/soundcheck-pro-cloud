/**
 * Sync Queue for offline mutations
 *
 * This module provides a queue system for tracking operations that need to be
 * synced when the application comes back online. Currently designed for future
 * cloud sync functionality.
 */

export interface SyncOperation {
  id: string
  type: 'create' | 'update' | 'delete'
  entity: 'rehearsal' | 'gig' | 'template' | 'mileage'
  data: unknown
  timestamp: number
  retryCount: number
  lastError?: string
}

const SYNC_QUEUE_KEY = 'soundcheck-sync-queue'
const MAX_RETRIES = 3

/**
 * Get all pending sync operations
 */
export const getSyncQueue = (): SyncOperation[] => {
  try {
    const queue = localStorage.getItem(SYNC_QUEUE_KEY)
    return queue ? JSON.parse(queue) : []
  } catch (error) {
    console.error('Error loading sync queue:', error)
    return []
  }
}

/**
 * Add an operation to the sync queue
 */
export const addToSyncQueue = (operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>): void => {
  const queue = getSyncQueue()
  const newOperation: SyncOperation = {
    ...operation,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    retryCount: 0,
  }

  queue.push(newOperation)
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue))
}

/**
 * Remove an operation from the sync queue
 */
export const removeFromSyncQueue = (operationId: string): void => {
  const queue = getSyncQueue()
  const filtered = queue.filter(op => op.id !== operationId)
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(filtered))
}

/**
 * Update an operation's retry count and error
 */
export const updateSyncOperation = (operationId: string, error?: string): void => {
  const queue = getSyncQueue()
  const updated = queue.map(op => {
    if (op.id === operationId) {
      return {
        ...op,
        retryCount: op.retryCount + 1,
        lastError: error,
      }
    }
    return op
  })

  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updated))
}

/**
 * Get count of pending operations
 */
export const getSyncQueueCount = (): number => {
  return getSyncQueue().length
}

/**
 * Clear all sync operations
 */
export const clearSyncQueue = (): void => {
  localStorage.removeItem(SYNC_QUEUE_KEY)
}

/**
 * Process sync queue (placeholder for future cloud sync)
 * This will be implemented when cloud sync is added
 */
export const processSyncQueue = async (): Promise<void> => {
  const queue = getSyncQueue()

  for (const operation of queue) {
    if (operation.retryCount >= MAX_RETRIES) {
      console.warn(`Operation ${operation.id} exceeded max retries, skipping`)
      continue
    }

    try {
      // TODO: Implement actual sync logic when cloud backend is ready
      // For now, this is a placeholder that simulates sync
      console.log('Processing sync operation:', operation)

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100))

      // Remove successful operation from queue
      removeFromSyncQueue(operation.id)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`Error syncing operation ${operation.id}:`, error)
      updateSyncOperation(operation.id, errorMessage)
    }
  }
}
