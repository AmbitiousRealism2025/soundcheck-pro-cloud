import { useStore } from '@/store/useStore'
import { calculateEarningsByMonth, calculateTotalEarnings } from '@/utils/analytics'
import { DollarSign, TrendingUp } from 'lucide-react'

/**
 * Earnings trend visualization
 * Shows earnings by month with bar chart
 */
export function EarningsTrendChart() {
  const gigs = useStore(state => state.gigs)
  const settings = useStore(state => state.settings)

  const earningsByMonth = calculateEarningsByMonth(gigs)
  const totalEarnings = calculateTotalEarnings(gigs)

  const months = Object.keys(earningsByMonth).slice(-6) // Last 6 months
  const values = months.map(month => earningsByMonth[month])
  const maxValue = Math.max(...values, 1)

  if (months.length === 0) {
    return (
      <div className="p-6 rounded-lg bg-white/5 border border-white/10">
        <h3 className="font-semibold mb-4">Earnings Trend</h3>
        <div className="text-center py-8 text-foreground/50">
          No earnings data yet. Complete some gigs!
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-lg bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Earnings Trend</h3>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign size={16} className="text-success" />
          <span className="font-semibold">
            {settings.currency} {totalEarnings.paid.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-success/20 border border-success/30">
          <div className="text-xs text-success/70 mb-1">Paid</div>
          <div className="font-semibold text-success">
            {settings.currency} {totalEarnings.paid.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-warning/20 border border-warning/30">
          <div className="text-xs text-warning/70 mb-1">Pending</div>
          <div className="font-semibold text-warning">
            {settings.currency} {totalEarnings.pending.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-info/20 border border-info/30">
          <div className="text-xs text-info/70 mb-1">Total</div>
          <div className="font-semibold text-info">
            {settings.currency} {totalEarnings.total.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-4">
        {months.map((month, idx) => {
          const value = values[idx]
          const percentage = (value / maxValue) * 100

          return (
            <div key={month}>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">{month}</span>
                <span className="font-semibold">
                  {settings.currency} {value.toLocaleString()}
                </span>
              </div>

              {/* Bar */}
              <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-success to-primary rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-sm">
        <span className="text-foreground/70">
          {totalEarnings.count} paid gig{totalEarnings.count !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1 text-success">
          <TrendingUp size={14} />
          Last 6 months
        </span>
      </div>
    </div>
  )
}
