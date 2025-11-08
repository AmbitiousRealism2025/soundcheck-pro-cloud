import { useParams, useNavigate } from 'react-router-dom'
import { useGigById, useGigs } from '@/store/hooks'
import { CompensationTracker } from '@/components/gigs/CompensationTracker'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { TimelineItem } from '@/components/ui/TimelineItem'
import { fmtDate } from '@/utils/dates'
import { directionsLink } from '@/utils/maps'
import { downloadIcs } from '@/utils/ics'
import { formatDistanceToNow } from 'date-fns'
import type { Compensation } from '@/types'

export default function GigDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const gig = useGigById(id!)
  const { updateGig, deleteGig } = useGigs()

  if (!gig) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg opacity-60 mb-4">Gig not found</p>
        <Button onClick={() => navigate('/gigs')}>Back to Gigs</Button>
      </div>
    )
  }

  const venueTitle = gig.venue.name
  const gigDate = new Date(gig.date)
  const callTime = gig.callTime ? new Date(gig.callTime) : null
  const countdown = formatDistanceToNow(gigDate, { addSuffix: true })

  const statusVariant = {
    pending: 'default' as const,
    confirmed: 'info' as const,
    completed: 'success' as const,
    cancelled: 'error' as const,
  }

  const handleDelete = async () => {
    if (window.confirm(`Delete gig at "${venueTitle}"? This cannot be undone.`)) {
      await deleteGig(gig.id)
      navigate('/gigs')
    }
  }

  const handleUpdateCompensation = async (compensation: Compensation) => {
    await updateGig({
      ...gig,
      compensation,
      updatedAt: Date.now(),
    })
  }

  const handleExportIcs = () => {
    downloadIcs({
      title: `Gig: ${venueTitle}`,
      startISO: gig.date,
      endISO: gig.callTime ?? gig.date,
      location: gig.venue.address,
      description: gig.notes,
      filename: `gig-${venueTitle.replace(/\s+/g, '-').toLowerCase()}.ics`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="glass rounded-xl p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">{venueTitle}</h1>
              <Badge variant={statusVariant[gig.status]} size="sm">
                {gig.status}
              </Badge>
            </div>
            <p className="text-xl opacity-80 mb-2">
              {fmtDate(gig.date, 'EEEE, MMMM d, yyyy')} at{' '}
              {fmtDate(gig.date, 'h:mm a')}
            </p>
            <p className="text-sm opacity-60">{countdown}</p>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => navigate('/gigs')}>
              Back
            </Button>
            <Button size="sm" variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 flex-wrap">
          {gig.venue.address && (
            <Button
              variant="primary"
              onClick={() => window.open(directionsLink(gig.venue.address!), '_blank')}
            >
              Get Directions
            </Button>
          )}
          <Button variant="secondary" onClick={handleExportIcs}>
            Export Calendar
          </Button>
          {gig.venue.contact && (
            <Button variant="ghost">Contact: {gig.venue.contact}</Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timeline & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          {callTime && (
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Timeline</h2>
              <div className="space-y-4">
                <TimelineItem
                  time={fmtDate(gig.callTime!, 'h:mm a')}
                  title="Call Time"
                  description="Arrive at venue"
                  status={new Date() > callTime ? 'past' : new Date() > new Date(callTime.getTime() - 60 * 60 * 1000) ? 'current' : 'upcoming'}
                />
                <TimelineItem
                  time={fmtDate(gig.date, 'h:mm a')}
                  title="Downbeat"
                  description="Performance starts"
                  status={new Date() > gigDate ? 'past' : new Date() > new Date(gigDate.getTime() - 30 * 60 * 1000) ? 'current' : 'upcoming'}
                />
              </div>
            </div>
          )}

          {/* Venue Details */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Venue Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm opacity-60">Name</p>
                <p className="text-lg font-medium">{gig.venue.name}</p>
              </div>
              {gig.venue.address && (
                <div>
                  <p className="text-sm opacity-60">Address</p>
                  <p>{gig.venue.address}</p>
                </div>
              )}
              {gig.venue.contact && (
                <div>
                  <p className="text-sm opacity-60">Contact</p>
                  <p>{gig.venue.contact}</p>
                </div>
              )}
              {gig.mileage && (
                <div>
                  <p className="text-sm opacity-60">Distance</p>
                  <p>{gig.mileage.toFixed(1)} miles from home</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {gig.notes && (
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Notes</h2>
              <p className="whitespace-pre-wrap opacity-80">{gig.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Compensation */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Compensation</h3>
            <CompensationTracker
              compensation={gig.compensation}
              onUpdate={handleUpdateCompensation}
            />
          </div>

          {/* Meta Info */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="opacity-60">Created</span>
                <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Last updated</span>
                <span>{new Date(gig.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Status</span>
                <Badge variant={statusVariant[gig.status]} size="sm">
                  {gig.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
