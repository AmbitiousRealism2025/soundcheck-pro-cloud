import { Link } from 'react-router-dom'
import { useGigs } from '@/store/hooks'
import { useSettings } from '@/store/hooks'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { fmtDate } from '@/utils/dates'

/**
 * Widget showing upcoming travel requirements
 */
export function TravelWidget() {
  const { gigs } = useGigs()
  const { settings } = useSettings()

  // Get upcoming gigs with addresses
  const now = new Date()
  const upcomingGigsWithTravel = gigs
    .filter((gig) => {
      const gigDate = new Date(gig.date)
      return gigDate >= now && gig.venue.address
    })
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)

  const hasHomeAddress = Boolean(settings.homeAddress)

  return (
    <Card title="Upcoming Travel" subtitle="Gigs with location">
      {upcomingGigsWithTravel.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm opacity-60 mb-4">No upcoming travel scheduled</p>
          <Link to="/gigs" className="text-primary text-sm font-medium hover:underline">
            View gigs →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {!hasHomeAddress && (
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-xs text-warning">
                Set your home address in{' '}
                <Link to="/settings" className="underline">
                  settings
                </Link>{' '}
                to calculate distances
              </p>
            </div>
          )}

          {upcomingGigsWithTravel.map((gig) => (
            <Link
              key={gig.id}
              to={`/gigs/${gig.id}`}
              className="block p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{gig.venue.name}</p>
                  <p className="text-xs opacity-60">
                    {fmtDate(gig.date, 'EEE, MMM d')} at {fmtDate(gig.date, 'h:mm a')}
                  </p>
                </div>
                <Badge variant="info" size="sm">
                  {gig.status}
                </Badge>
              </div>
              <p className="text-xs opacity-40 truncate">{gig.venue.address}</p>
              {gig.mileage && (
                <p className="text-xs opacity-60 mt-1">
                  ~{gig.mileage.toFixed(1)} miles
                </p>
              )}
            </Link>
          ))}

          <Link
            to="/gigs"
            className="block text-center text-sm text-primary py-2 hover:underline"
          >
            View all gigs →
          </Link>
        </div>
      )}
    </Card>
  )
}
