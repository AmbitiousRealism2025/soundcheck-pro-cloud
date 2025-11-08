import { useStore } from '@/store/useStore'
import { calculateTotalMileage } from '@/utils/analytics'
import { format } from 'date-fns'
import { Car, Download, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'

/**
 * Mileage ledger table
 * Shows all mileage logs with totals and export option
 */
export function MileageLedger() {
  const mileageLogs = useStore(state => state.mileageLogs || [])
  const gigs = useStore(state => state.gigs)
  const settings = useStore(state => state.settings)

  const totals = calculateTotalMileage(mileageLogs)

  const handleExportCSV = () => {
    const headers = ['Date', 'Gig', 'Origin', 'Destination', 'Distance (mi)', 'Rate', 'Amount']
    const rows = mileageLogs.map(log => {
      const gig = gigs.find(g => g.id === log.gigId)
      return [
        format(new Date(log.date), 'yyyy-MM-dd'),
        gig?.eventName || gig?.venue.name || 'Unknown',
        log.origin,
        log.destination,
        log.distance.toString(),
        log.rate.toString(),
        log.amount.toFixed(2),
      ]
    })

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mileage-log-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (mileageLogs.length === 0) {
    return (
      <div className="p-6 rounded-lg bg-white/5 border border-white/10">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Car size={20} />
          Mileage Ledger
        </h3>
        <div className="text-center py-8 text-foreground/50">
          <Car size={48} className="mx-auto mb-4 opacity-20" />
          <p>No mileage logs yet.</p>
          <p className="text-sm mt-1">Mileage is calculated when you add gig venues.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-lg bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold flex items-center gap-2">
          <Car size={20} />
          Mileage Ledger
        </h3>
        <Button variant="secondary" size="sm" onClick={handleExportCSV}>
          <Download size={14} />
          Export CSV
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-primary/20 border border-primary/30">
          <div className="text-xs text-primary/70 mb-1">Total Distance</div>
          <div className="text-2xl font-bold text-primary">
            {totals.totalDistance.toLocaleString()}
            <span className="text-sm font-normal ml-1">mi</span>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-success/20 border border-success/30">
          <div className="text-xs text-success/70 mb-1">Total Reimbursement</div>
          <div className="text-2xl font-bold text-success">
            {settings.currency} {totals.totalAmount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-2 font-medium text-foreground/70">Date</th>
              <th className="text-left py-3 px-2 font-medium text-foreground/70">Gig</th>
              <th className="text-left py-3 px-2 font-medium text-foreground/70">Route</th>
              <th className="text-right py-3 px-2 font-medium text-foreground/70">Distance</th>
              <th className="text-right py-3 px-2 font-medium text-foreground/70">Amount</th>
            </tr>
          </thead>
          <tbody>
            {mileageLogs.map(log => {
              const gig = gigs.find(g => g.id === log.gigId)

              return (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-2">
                    {format(new Date(log.date), 'MMM d, yyyy')}
                  </td>
                  <td className="py-3 px-2">
                    <div className="font-medium">
                      {gig?.eventName || gig?.venue.name || 'Unknown'}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-start gap-1 text-foreground/70">
                      <MapPin size={12} className="mt-1 flex-shrink-0" />
                      <div className="text-xs">
                        <div className="truncate max-w-xs">{log.origin}</div>
                        <div className="truncate max-w-xs">→ {log.destination}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums">
                    {log.distance.toFixed(1)} mi
                  </td>
                  <td className="py-3 px-2 text-right font-medium tabular-nums">
                    {settings.currency} {log.amount.toFixed(2)}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-white/20 font-semibold">
              <td colSpan={3} className="py-3 px-2">
                Total ({totals.count} trip{totals.count !== 1 ? 's' : ''})
              </td>
              <td className="py-3 px-2 text-right tabular-nums">
                {totals.totalDistance.toFixed(1)} mi
              </td>
              <td className="py-3 px-2 text-right tabular-nums">
                {settings.currency} {totals.totalAmount.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
