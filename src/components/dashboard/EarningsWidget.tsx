import { Link } from 'react-router-dom'
import { useGigs } from '@/store/hooks'
import { Card } from '@/components/ui/Card'
import { StatBadge } from '@/components/ui/StatBadge'
import { useSettings } from '@/store/hooks'

/**
 * Widget showing earnings summary
 */
export function EarningsWidget() {
  const { gigs } = useGigs()
  const { settings } = useSettings()

  // Calculate earnings for current month
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const currentMonthGigs = gigs.filter((gig) => {
    if (!gig.compensation) return false
    const gigDate = new Date(gig.date)
    return gigDate >= currentMonthStart && gigDate <= currentMonthEnd
  })

  const totalEarnings = currentMonthGigs.reduce(
    (sum, gig) => sum + (gig.compensation?.amount || 0),
    0
  )

  const paidEarnings = currentMonthGigs
    .filter((gig) => gig.compensation?.status === 'paid')
    .reduce((sum, gig) => sum + (gig.compensation?.amount || 0), 0)

  const pendingEarnings = totalEarnings - paidEarnings

  const currency = settings.currency || 'USD'
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  return (
    <Card title="Earnings This Month" subtitle={now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}>
      <div className="space-y-4">
        <StatBadge
          label="Total"
          value={formatCurrency(totalEarnings)}
        />
        <div className="grid grid-cols-2 gap-4">
          <StatBadge
            label="Paid"
            value={formatCurrency(paidEarnings)}
          />
          <StatBadge
            label="Pending"
            value={formatCurrency(pendingEarnings)}
          />
        </div>

        {currentMonthGigs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs opacity-60 mb-2">Recent gigs</p>
            <div className="space-y-2">
              {currentMonthGigs.slice(0, 3).map((gig) => (
                <Link
                  key={gig.id}
                  to={`/gigs/${gig.id}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm truncate">{gig.venue.name}</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(gig.compensation?.amount || 0)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link
          to="/gigs"
          className="block text-center text-sm text-primary py-2 hover:underline"
        >
          View all gigs →
        </Link>
      </div>
    </Card>
  )
}
