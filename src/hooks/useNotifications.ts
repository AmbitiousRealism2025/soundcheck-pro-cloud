import { useMemo, useCallback } from 'react'
import { useStore } from '@/store/useStore'
import { differenceInHours, differenceInMinutes, isPast } from 'date-fns'

export interface Notification {
  id: string
  type: 'call-time' | 'overdue-task' | 'payment-reminder' | 'info'
  title: string
  message: string
  timestamp: number
  action?: {
    label: string
    path: string
  }
  priority: 'high' | 'medium' | 'low'
}

const DISMISSED_NOTIFICATIONS_KEY = 'soundcheck-dismissed-notifications'

/**
 * Hook for generating and managing notifications
 * Checks for upcoming call times, overdue tasks, and pending payments
 */
export function useNotifications() {
  const gigs = useStore(state => state.gigs)
  const rehearsals = useStore(state => state.rehearsals)

  // Get dismissed notification IDs from localStorage
  const getDismissedIds = useCallback((): Set<string> => {
    try {
      const stored = localStorage.getItem(DISMISSED_NOTIFICATIONS_KEY)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  }, [])

  // Dismiss a notification
  const dismissNotification = useCallback((id: string) => {
    const dismissed = getDismissedIds()
    dismissed.add(id)
    try {
      localStorage.setItem(DISMISSED_NOTIFICATIONS_KEY, JSON.stringify(Array.from(dismissed)))
    } catch {
      // Ignore localStorage errors
    }
  }, [getDismissedIds])

  // Clear all dismissed notifications (useful for testing)
  const clearDismissed = useCallback(() => {
    try {
      localStorage.removeItem(DISMISSED_NOTIFICATIONS_KEY)
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Generate notifications
  const notifications = useMemo((): Notification[] => {
    const notifs: Notification[] = []
    const now = new Date()
    const dismissed = getDismissedIds()

    // Check upcoming call times (within 24 hours)
    gigs.forEach(gig => {
      const callTime = gig.callTime ? new Date(gig.callTime) : new Date(gig.date)
      const hoursUntil = differenceInHours(callTime, now)
      const minutesUntil = differenceInMinutes(callTime, now)

      // Only show if within 24 hours and in the future
      if (hoursUntil >= 0 && hoursUntil < 24) {
        const notifId = `call-time-${gig.id}`

        if (!dismissed.has(notifId)) {
          let message = ''
          let priority: 'high' | 'medium' | 'low' = 'low'

          if (minutesUntil < 60) {
            message = `Call time in ${minutesUntil} minutes!`
            priority = 'high'
          } else if (hoursUntil < 6) {
            message = `Call time in ${hoursUntil} hours`
            priority = 'high'
          } else {
            message = `Call time in ${hoursUntil} hours`
            priority = 'medium'
          }

          notifs.push({
            id: notifId,
            type: 'call-time',
            title: gig.eventName || gig.venue.name,
            message,
            timestamp: callTime.getTime(),
            action: {
              label: 'View Details',
              path: `/gigs/${gig.id}`,
            },
            priority,
          })
        }
      }
    })

    // Check for overdue tasks (rehearsals in the past with open tasks)
    rehearsals.forEach(rehearsal => {
      const rehearsalDate = new Date(rehearsal.date)

      if (isPast(rehearsalDate)) {
        const openTasks = rehearsal.tasks?.filter(task => task.status === 'open') || []

        if (openTasks.length > 0) {
          const notifId = `overdue-tasks-${rehearsal.id}`

          if (!dismissed.has(notifId)) {
            notifs.push({
              id: notifId,
              type: 'overdue-task',
              title: rehearsal.eventName,
              message: `${openTasks.length} task${openTasks.length > 1 ? 's' : ''} still open`,
              timestamp: rehearsalDate.getTime(),
              action: {
                label: 'Complete Tasks',
                path: `/rehearsals/${rehearsal.id}`,
              },
              priority: 'low',
            })
          }
        }
      }
    })

    // Check for pending payments (completed gigs with pending compensation)
    gigs.forEach(gig => {
      if (gig.status === 'completed' && gig.compensation?.status === 'pending') {
        const notifId = `payment-pending-${gig.id}`

        if (!dismissed.has(notifId)) {
          const gigDate = new Date(gig.date)
          const daysSince = Math.floor((now.getTime() - gigDate.getTime()) / (1000 * 60 * 60 * 24))

          notifs.push({
            id: notifId,
            type: 'payment-reminder',
            title: gig.eventName || gig.venue.name,
            message: `Payment pending (${daysSince} day${daysSince !== 1 ? 's' : ''} ago)`,
            timestamp: gigDate.getTime(),
            action: {
              label: 'Mark as Paid',
              path: `/gigs/${gig.id}`,
            },
            priority: daysSince > 7 ? 'high' : 'medium',
          })
        }
      }
    })

    // Sort by priority and timestamp
    return notifs.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff

      // For call times, sort by soonest first
      // For others, sort by most recent first
      if (a.type === 'call-time' && b.type === 'call-time') {
        return a.timestamp - b.timestamp
      }
      return b.timestamp - a.timestamp
    })
  }, [gigs, rehearsals, getDismissedIds])

  return {
    notifications,
    unreadCount: notifications.length,
    dismissNotification,
    clearDismissed,
  }
}
