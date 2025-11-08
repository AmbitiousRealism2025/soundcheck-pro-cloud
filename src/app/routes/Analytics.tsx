import { useStore } from '@/store/useStore'
import { RehearsalStatsChart } from '@/components/analytics/RehearsalStatsChart'
import { EarningsTrendChart } from '@/components/analytics/EarningsTrendChart'
import { MileageLedger } from '@/components/analytics/MileageLedger'
import { StatBadge } from '@/components/ui/StatBadge'
import { getRehearsalStatistics, getGigStatistics, getTopEarningVenues } from '@/utils/analytics'
import { BarChart3, Music, Calendar } from 'lucide-react'

/**
 * Analytics & Insights page
 * Displays statistics, trends, and insights for rehearsals, gigs, earnings, and mileage
 */
export default function Analytics() {
  const rehearsals = useStore(state => state.rehearsals)
  const gigs = useStore(state => state.gigs)
  const settings = useStore(state => state.settings)

  const rehearsalStats = getRehearsalStatistics(rehearsals)
  const gigStats = getGigStatistics(gigs)
  const topVenues = getTopEarningVenues(gigs)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <BarChart3 size={32} />
          Analytics & Insights
        </h1>
        <p className="text-foreground/70">
          Track your rehearsals, gigs, earnings, and mileage
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatBadge
          label="Total Rehearsals"
          value={rehearsalStats.total.toString()}
          icon={<Music size={20} />}
          trend={rehearsalStats.upcoming > 0 ? 'up' : undefined}
          trendValue={rehearsalStats.upcoming > 0 ? `${rehearsalStats.upcoming} upcoming` : undefined}
        />

        <StatBadge
          label="Total Gigs"
          value={gigStats.total.toString()}
          icon={<Calendar size={20} />}
          trend={gigStats.upcoming > 0 ? 'up' : undefined}
          trendValue={gigStats.upcoming > 0 ? `${gigStats.upcoming} upcoming` : undefined}
        />

        <StatBadge
          label="Task Completion"
          value={`${rehearsalStats.totalTasks > 0
            ? Math.round((rehearsalStats.completedTasks / rehearsalStats.totalTasks) * 100)
            : 0
            }%`}
          icon={<Music size={20} />}
          trend={rehearsalStats.completedTasks > 0 ? 'up' : undefined}
          trendValue={rehearsalStats.completedTasks > 0 ? `${rehearsalStats.completedTasks} completed` : undefined}
        />

        <StatBadge
          label="Gig Status"
          value={`${gigStats.confirmed} Confirmed`}
          icon={<Calendar size={20} />}
          trend={gigStats.pending > 0 ? 'neutral' : undefined}
          trendValue={gigStats.pending > 0 ? `${gigStats.pending} pending` : undefined}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <RehearsalStatsChart />
        <EarningsTrendChart />
      </div>

      {/* Top Earning Venues */}
      {topVenues.length > 0 && (
        <div className="mb-6 p-6 rounded-lg bg-white/5 border border-white/10">
          <h3 className="font-semibold mb-4">Top Earning Venues</h3>
          <div className="space-y-3">
            {topVenues.map((venue, idx) => (
              <div key={venue.name} className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{venue.name}</div>
                  <div className="text-xs text-foreground/50">
                    {venue.count} gig{venue.count !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="font-semibold">
                  {settings.currency} {venue.total.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mileage Ledger */}
      <MileageLedger />

      {/* Empty State */}
      {rehearsals.length === 0 && gigs.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 size={64} className="mx-auto mb-4 text-foreground/20" />
          <h3 className="text-xl font-semibold mb-2">No data yet</h3>
          <p className="text-foreground/70 mb-6">
            Create some rehearsals and gigs to see your analytics
          </p>
        </div>
      )}
    </div>
  )
}
