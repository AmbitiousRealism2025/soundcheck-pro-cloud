import { useStore } from '@/store/useStore'
import { getRehearsalCompletionData } from '@/utils/analytics'
import { format } from 'date-fns'
import { TrendingUp, CheckCircle2 } from 'lucide-react'

/**
 * Rehearsal stats visualization
 * Shows completion percentage for recent rehearsals
 */
export function RehearsalStatsChart() {
  const rehearsals = useStore(state => state.rehearsals)

  // Get recent rehearsals (last 10)
  const recentRehearsals = rehearsals
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  const completionData = getRehearsalCompletionData(recentRehearsals).reverse()

  const avgCompletion =
    completionData.length > 0
      ? Math.round(
          completionData.reduce((sum, item) => sum + item.percentage, 0) / completionData.length
        )
      : 0

  if (completionData.length === 0) {
    return (
      <div className="p-6 rounded-lg bg-white/5 border border-white/10">
        <h3 className="font-semibold mb-4">Rehearsal Completion</h3>
        <div className="text-center py-8 text-foreground/50">
          No rehearsals yet. Create your first one!
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-lg bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Rehearsal Completion</h3>
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp size={16} className="text-success" />
          <span className="text-foreground/70">Avg:</span>
          <span className="font-semibold">{avgCompletion}%</span>
        </div>
      </div>

      <div className="space-y-4">
        {completionData.map(item => (
          <div key={item.id}>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium truncate flex-1 mr-2">
                {item.eventName}
              </span>
              <span className="text-foreground/50 text-xs mr-2">
                {format(new Date(item.date), 'MMM d')}
              </span>
              <span className="font-semibold min-w-[3rem] text-right">
                {item.percentage}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                  item.percentage === 100
                    ? 'bg-success'
                    : item.percentage >= 50
                    ? 'bg-primary'
                    : 'bg-warning'
                }`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>

            <div className="flex items-center gap-1 mt-1 text-xs text-foreground/50">
              <CheckCircle2 size={12} />
              <span>
                {item.completed} of {item.total} tasks
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
