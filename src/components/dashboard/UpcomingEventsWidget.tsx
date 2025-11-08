import { Link } from 'react-router-dom'
import { useUpcomingEvents } from '@/store/hooks'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { fmtDate } from '@/utils/dates'
import { formatDistanceToNow } from 'date-fns'

/**
 * Widget showing upcoming events (rehearsals and gigs) for the next 7 days
 */
export function UpcomingEventsWidget() {
  const events = useUpcomingEvents()

  // Filter to only show next 7 days
  const now = new Date()
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.date)
    return eventDate >= now && eventDate <= sevenDaysFromNow
  })

  return (
    <Card title="Upcoming Events" subtitle="Next 7 days">
      {upcomingEvents.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm opacity-60 mb-4">No upcoming events. Create one!</p>
          <Link
            to="/rehearsals"
            className="text-primary text-sm font-medium hover:underline"
          >
            View all events →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingEvents.slice(0, 5).map((event) => {
            const eventDate = new Date(event.date)
            const countdown = formatDistanceToNow(eventDate, { addSuffix: true })

            return (
              <Link
                key={event.id}
                to={`/${event.type === 'rehearsal' ? 'rehearsals' : 'gigs'}/${event.id}`}
                className="block p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={event.type === 'rehearsal' ? 'info' : 'success'}
                        size="sm"
                      >
                        {event.type}
                      </Badge>
                      <span className="text-sm font-medium truncate">
                        {event.type === 'rehearsal'
                          ? ('eventName' in event ? event.eventName : '')
                          : ('venue' in event ? event.venue.name : '')}
                      </span>
                    </div>
                    <p className="text-xs opacity-60">
                      {fmtDate(event.date, 'EEE, MMM d')} at {fmtDate(event.date, 'h:mm a')}
                    </p>
                  </div>
                  <div className="text-xs opacity-40 whitespace-nowrap">{countdown}</div>
                </div>
              </Link>
            )
          })}
          {upcomingEvents.length > 5 && (
            <Link
              to="/rehearsals"
              className="block text-center text-sm text-primary py-2 hover:underline"
            >
              View {upcomingEvents.length - 5} more →
            </Link>
          )}
        </div>
      )}
    </Card>
  )
}
