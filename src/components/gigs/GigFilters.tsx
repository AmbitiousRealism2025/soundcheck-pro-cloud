import { Input } from '@/components/ui/Input'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type { GigStatus } from '@/types'

export type GigFilterStatus = GigStatus | 'all'

interface GigFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: GigFilterStatus
  onStatusFilterChange: (value: GigFilterStatus) => void
}

/**
 * Filter controls for gigs list
 */
export function GigFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: GigFiltersProps) {
  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div className="space-y-4">
      <Input
        type="search"
        placeholder="Search gigs..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div>
        <label className="text-xs opacity-60 mb-2 block">Filter by status</label>
        <SegmentedControl
          options={statusOptions}
          value={statusFilter}
          onChange={(value) => onStatusFilterChange(value as GigFilterStatus)}
        />
      </div>
    </div>
  )
}
