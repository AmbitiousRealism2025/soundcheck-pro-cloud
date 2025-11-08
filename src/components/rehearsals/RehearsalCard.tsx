import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { fmtDate } from '@/utils/dates'
import type { Rehearsal } from '@/types'
import { useRehearsals } from '@/store/hooks'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useState } from 'react'

interface RehearsalCardProps {
  rehearsal: Rehearsal
}

/**
 * Card component for displaying a rehearsal in list view
 */
export function RehearsalCard({ rehearsal }: RehearsalCardProps) {
  const { deleteRehearsal, duplicateRehearsal } = useRehearsals()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const completedTasks = rehearsal.tasks.filter((t) => t.status === 'closed').length
  const totalTasks = rehearsal.tasks.length
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    await deleteRehearsal(rehearsal.id)
    setDeleteDialogOpen(false)
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
  }

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault()
    await duplicateRehearsal(rehearsal.id)
  }

  return (
    <Link to={`/rehearsals/${rehearsal.id}`} data-testid="rehearsal-card">
      <Card className="group hover:scale-[1.02] transition-transform">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate mb-1">
              {rehearsal.eventName}
            </h3>
            <p className="text-sm opacity-60">
              {fmtDate(rehearsal.date, 'EEE, MMM d')} at {fmtDate(rehearsal.date, 'h:mm a')}
            </p>
            {rehearsal.location && (
              <p className="text-xs opacity-40 mt-1">{rehearsal.location}</p>
            )}
          </div>
          {rehearsal.templateId && (
            <Badge variant="info" size="sm">
              Template
            </Badge>
          )}
        </div>

        {/* Task Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="opacity-60">Tasks</span>
            <span className="opacity-80">
              {completedTasks}/{totalTasks} ({completionPercentage}%)
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDuplicate}
            className="flex-1"
            data-testid="duplicate-rehearsal-button"
          >
            Duplicate
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={handleDelete}
            className="flex-1"
            data-testid="delete-rehearsal-button"
          >
            Delete
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete rehearsal?"
        description={
          <>
            <p>
              This will permanently delete
              {' '}
              <strong>{rehearsal.eventName}</strong>
              .
            </p>
            <p className="mt-1 text-warning">
              This action cannot be undone.
            </p>
          </>
        }
        confirmLabel="Delete rehearsal"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Link>
  )
}
