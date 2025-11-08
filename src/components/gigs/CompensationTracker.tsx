import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useSettings } from '@/store/hooks'
import type { Compensation } from '@/types'

interface CompensationTrackerProps {
  compensation?: Compensation
  onUpdate: (compensation: Compensation) => void
}

/**
 * Component for tracking gig compensation
 */
export function CompensationTracker({
  compensation,
  onUpdate,
}: CompensationTrackerProps) {
  const { settings } = useSettings()

  if (!compensation) {
    return (
      <div className="text-center py-8">
        <p className="text-sm opacity-60">No compensation set for this gig</p>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: compensation.currency || settings.currency || 'USD',
    }).format(amount)
  }

  const handleMarkAsPaid = () => {
    onUpdate({
      ...compensation,
      status: 'paid',
      paidAt: Date.now(),
    })
  }

  const handleMarkAsPending = () => {
    onUpdate({
      ...compensation,
      status: 'pending',
      paidAt: undefined,
    })
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-3xl font-bold mb-2">{formatCurrency(compensation.amount)}</p>
        <Badge
          variant={compensation.status === 'paid' ? 'success' : 'warning'}
          size="lg"
        >
          {compensation.status === 'paid' ? 'Paid' : 'Pending Payment'}
        </Badge>
      </div>

      {compensation.status === 'paid' && compensation.paidAt && (
        <p className="text-sm opacity-60 text-center">
          Paid on {new Date(compensation.paidAt).toLocaleDateString()}
        </p>
      )}

      {compensation.method && (
        <p className="text-sm opacity-60 text-center">
          Payment method: {compensation.method}
        </p>
      )}

      <div className="pt-4">
        {compensation.status === 'pending' ? (
          <Button variant="success" onClick={handleMarkAsPaid} className="w-full">
            Mark as Paid
          </Button>
        ) : (
          <Button variant="ghost" onClick={handleMarkAsPending} className="w-full">
            Mark as Pending
          </Button>
        )}
      </div>
    </div>
  )
}
