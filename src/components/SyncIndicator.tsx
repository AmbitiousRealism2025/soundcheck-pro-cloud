import { useSyncStatus } from '@/hooks/useSyncStatus'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export function SyncIndicator() {
  const isOnline = useOnlineStatus()
  const { isSyncing, pendingCount, lastSyncedAt } = useSyncStatus()

  const getStatusText = () => {
    if (!isOnline) {
      return pendingCount > 0 ? `Offline (${pendingCount} pending)` : 'Offline'
    }
    if (isSyncing) {
      return 'Syncing...'
    }
    return 'Synced'
  }

  const getStatusColor = () => {
    if (!isOnline) return 'text-yellow-500'
    if (isSyncing) return 'text-blue-500'
    return 'text-green-500'
  }

  const formatLastSynced = () => {
    if (!lastSyncedAt) return null

    const now = Date.now()
    const diff = now - lastSyncedAt
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'Just now'
    if (minutes === 1) return '1 minute ago'
    if (minutes < 60) return `${minutes} minutes ago`

    const hours = Math.floor(minutes / 60)
    if (hours === 1) return '1 hour ago'
    if (hours < 24) return `${hours} hours ago`

    return new Date(lastSyncedAt).toLocaleDateString()
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`flex items-center gap-1.5 ${getStatusColor()}`}>
        {/* Status dot */}
        <div className="relative">
          <div
            className={`h-2 w-2 rounded-full ${
              !isOnline
                ? 'bg-yellow-500'
                : isSyncing
                ? 'bg-blue-500'
                : 'bg-green-500'
            }`}
          />
          {isSyncing && (
            <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-blue-500 opacity-75" />
          )}
        </div>

        {/* Status text */}
        <span className="font-medium">{getStatusText()}</span>
      </div>

      {/* Last synced timestamp */}
      {lastSyncedAt && isOnline && !isSyncing && (
        <span className="text-xs text-gray-500">
          • {formatLastSynced()}
        </span>
      )}
    </div>
  )
}
