import { Input } from '@/components/ui/Input'
import { SegmentedControl } from '@/components/ui/SegmentedControl'

export type GroupBy = 'date' | 'status' | 'none'

interface RehearsalFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  groupBy: GroupBy
  onGroupByChange: (value: GroupBy) => void
}

/**
 * Filter controls for rehearsals list
 */
export function RehearsalFilters({
  search,
  onSearchChange,
  groupBy,
  onGroupByChange,
}: RehearsalFiltersProps) {
  const groupByOptions = [
    { value: 'none', label: 'All' },
    { value: 'date', label: 'By Date' },
    { value: 'status', label: 'By Status' },
  ]

  return (
    <div className="space-y-4">
      <Input
        type="search"
        placeholder="Search rehearsals..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div>
        <label className="text-xs opacity-60 mb-2 block">Group by</label>
        <SegmentedControl
          options={groupByOptions}
          value={groupBy}
          onChange={(value) => onGroupByChange(value as GroupBy)}
        />
      </div>
    </div>
  )
}
