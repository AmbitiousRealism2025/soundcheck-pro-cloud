import { useNavigate } from 'react-router-dom'
import { Bell, X, Clock, CheckSquare, DollarSign, Info, ExternalLink } from 'lucide-react'
import { Sheet } from '@/components/ui/Sheet'
import { useNotifications, type Notification } from '@/hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'

interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
}

const NOTIFICATION_ICONS = {
  'call-time': Clock,
  'overdue-task': CheckSquare,
  'payment-reminder': DollarSign,
  'info': Info,
}

const PRIORITY_COLORS = {
  high: 'bg-error/20 text-error border-error/30',
  medium: 'bg-warning/20 text-warning border-warning/30',
  low: 'bg-info/20 text-info border-info/30',
}

function NotificationItem({
  notification,
  onDismiss,
  onAction,
}: {
  notification: Notification
  onDismiss: (id: string) => void
  onAction: (path: string) => void
}) {
  const Icon = NOTIFICATION_ICONS[notification.type]
  const colorClass = PRIORITY_COLORS[notification.priority]

  return (
    <div
      className={`
        relative p-4 rounded-lg border
        ${colorClass}
        hover:brightness-110 transition-all
      `}
    >
      {/* Dismiss button */}
      <button
        onClick={() => onDismiss(notification.id)}
        className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>

      {/* Content */}
      <div className="flex gap-3 pr-6">
        <div className="flex-shrink-0 mt-0.5">
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm mb-1">{notification.title}</div>
          <div className="text-sm opacity-90 mb-2">{notification.message}</div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs opacity-70">
              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
            </span>

            {notification.action && (
              <button
                onClick={() => onAction(notification.action!.path)}
                className="flex items-center gap-1 text-xs font-medium hover:underline"
              >
                {notification.action.label}
                <ExternalLink size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Notifications panel component
 * Shows upcoming call times, overdue tasks, and payment reminders
 */
export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const navigate = useNavigate()
  const { notifications, dismissNotification, clearDismissed } = useNotifications()

  const handleAction = (path: string) => {
    navigate(path)
    onClose()
  }

  const handleDismissAll = () => {
    notifications.forEach(notif => dismissNotification(notif.id))
  }

  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      side="right"
      title="Notifications"
    >
      <div className="flex flex-col h-full">
        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <span className="text-sm text-foreground/70">
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={handleDismissAll}
              className="text-sm text-primary hover:underline"
            >
              Dismiss All
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Bell size={48} className="text-foreground/20 mb-4" />
              <p className="text-foreground/70 mb-2">No notifications</p>
              <p className="text-sm text-foreground/50">
                You're all caught up! We'll notify you about upcoming call times and overdue tasks.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDismiss={dismissNotification}
                  onAction={handleAction}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {import.meta.env.DEV && notifications.length === 0 && (
          <div className="p-4 border-t border-white/10">
            <button
              onClick={clearDismissed}
              className="w-full px-3 py-2 text-xs bg-white/5 hover:bg-white/10 rounded transition-colors"
            >
              Clear Dismissed (Dev)
            </button>
          </div>
        )}
      </div>
    </Sheet>
  )
}
