import { useEffect, useState } from 'react'
import { useOnlineStatus } from './useOnlineStatus'
import { getSyncQueueCount, processSyncQueue } from '@/service-worker/sync-queue'

export interface SyncStatus {
  isSyncing: boolean
  pendingCount: number
  lastSyncedAt: number | null
}

/**
 * Hook to track sync status
 * Automatically syncs when coming back online
 */
export const useSyncStatus = (): SyncStatus => {
  const isOnline = useOnlineStatus()
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingCount, setPendingCount] = useState(getSyncQueueCount())
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(() => {
    const stored = localStorage.getItem('soundcheck-last-synced')
    return stored ? parseInt(stored, 10) : null
  })

  // Update pending count periodically
  useEffect(() => {
    const updatePendingCount = () => {
      setPendingCount(getSyncQueueCount())
    }

    const interval = setInterval(updatePendingCount, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
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
          setPendingCount(getSyncQueueCount())
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
