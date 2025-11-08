import { useEffect, useState } from 'react'
import { useOnlineStatus } from './useOnlineStatus'
import { getSyncQueueCount, processSyncQueue, onSyncQueueUpdate } from '@/service-worker/sync-queue'
import { db } from '@/db/db'
import { liveQuery } from 'dexie'

export interface SyncStatus {
  isSyncing: boolean
  pendingCount: number
  lastSyncedAt: number | null
}

/**
 * Hook to track sync status
 * Automatically syncs when coming back online
 * Uses Dexie live queries for reactive updates across tabs
 */
export const useSyncStatus = (): SyncStatus => {
  const isOnline = useOnlineStatus()
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(() => {
    const stored = localStorage.getItem('soundcheck-last-synced')
    return stored ? parseInt(stored, 10) : null
  })

  // Use Dexie live query for reactive pending count updates
  useEffect(() => {
    const subscription = liveQuery(async () => {
      return await getSyncQueueCount()
    }).subscribe({
      next: (count) => {
        setPendingCount(count)
      },
      error: (error) => {
        console.error('Error in sync queue live query:', error)
      },
    })

    return () => subscription.unsubscribe()
  }, [])

  // Listen for cross-tab sync updates via BroadcastChannel
  useEffect(() => {
    const cleanup = onSyncQueueUpdate((count) => {
      setPendingCount(count)
    })

    return cleanup
  }, [])

  // Sync when coming back online
  useEffect(() => {
    if (isOnline && pendingCount > 0 && !isSyncing) {
      const sync = async () => {
        setIsSyncing(true)
        try {
          await processSyncQueue()
          const now = Date.now()
          setLastSyncedAt(now)
          localStorage.setItem('soundcheck-last-synced', now.toString())

          // Update pending count after sync
          const newCount = await getSyncQueueCount()
          setPendingCount(newCount)
        } catch (error) {
          console.error('Sync failed:', error)
        } finally {
          setIsSyncing(false)
        }
      }

      // Delay sync slightly to avoid immediate sync on connection
      const timeout = setTimeout(sync, 1000)
      return () => clearTimeout(timeout)
    }
  }, [isOnline, pendingCount, isSyncing])

  return {
    isSyncing,
    pendingCount,
    lastSyncedAt,
  }
}
