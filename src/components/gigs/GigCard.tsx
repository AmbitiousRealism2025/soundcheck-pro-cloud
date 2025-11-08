import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { fmtDate } from '@/utils/dates'
import type { Gig } from '@/types'
import { useGigs } from '@/store/hooks'
import { useSettings } from '@/store/hooks'

interface GigCardProps {
  gig: Gig
}

const gradientVariants = [
  'from-purple-500/20 to-pink-500/20',
  'from-blue-500/20 to-cyan-500/20',
  'from-green-500/20 to-emerald-500/20',
  'from-orange-500/20 to-red-500/20',
  'from-indigo-500/20 to-purple-500/20',
]

/**
 * Stylized card for displaying a gig
 */
export function GigCard({ gig }: GigCardProps) {
  const { deleteGig } = useGigs()
  const { settings } = useSettings()

  // Pick gradient based on gig ID for consistency
  const gradientIndex = parseInt(gig.id.slice(-1), 36) % gradientVariants.length
  const gradient = gradientVariants[gradientIndex]

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (window.confirm(`Delete gig at "${gig.venue.name}"? This cannot be undone.`)) {
      await deleteGig(gig.id)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.currency || 'USD',
    }).format(amount)
  }

  const statusVariant = {
    pending: 'default' as const,
    confirmed: 'info' as const,
    completed: 'success' as const,
    cancelled: 'error' as const,
  }

  return (
    <Link to={`/gigs/${gig.id}`}>
      <Card
        className={`group hover:scale-[1.02] transition-transform bg-gradient-to-br ${gradient} relative overflow-hidden`}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate mb-1">
              {gig.venue.name}
            </h3>
            <p className="text-sm opacity-80">
              {fmtDate(gig.date, 'EEE, MMM d')} at {fmtDate(gig.date, 'h:mm a')}
            </p>
            {gig.venue.address && (
              <p className="text-xs opacity-60 mt-1 truncate">{gig.venue.address}</p>
            )}
          </div>
          <Badge variant={statusVariant[gig.status]} size="sm">
            {gig.status}
          </Badge>
        </div>

        {/* Compensation Badge */}
        {gig.compensation && (
          <div className="flex items-center gap-2 mb-3">
            <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
              <span className="text-sm font-medium">
                {formatCurrency(gig.compensation.amount)}
              </span>
            </div>
            {gig.compensation.status === 'paid' && (
              <Badge variant="success" size="sm">
                Paid
              </Badge>
            )}
          </div>
        )}

        {/* Travel Indicator */}
        {gig.venue.address && (
          <div className="flex items-center gap-2 text-xs opacity-60 mb-3">
            <span>📍</span>
            <span>Has location</span>
            {gig.mileage && <span>• {gig.mileage.toFixed(1)} mi</span>}
          </div>
        )}

        {/* Actions */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="danger"
            onClick={handleDelete}
            className="w-full"
          >
            Delete
          </Button>
        </div>
      </Card>
    </Link>
  )
}
