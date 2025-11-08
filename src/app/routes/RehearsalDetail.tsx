import { useParams, useNavigate } from 'react-router-dom'
import { useRehearsalById } from '@/store/hooks'
import { useRehearsals } from '@/store/hooks'
import { KanbanBoard } from '@/components/rehearsals/KanbanBoard'
import { NotesSection } from '@/components/rehearsals/NotesSection'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { fmtDate } from '@/utils/dates'
import type { Task, Note } from '@/types'

export default function RehearsalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const rehearsal = useRehearsalById(id!)
  const { updateRehearsal, deleteRehearsal, duplicateRehearsal } = useRehearsals()

  if (!rehearsal) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg opacity-60 mb-4">Rehearsal not found</p>
        <Button onClick={() => navigate('/rehearsals')}>Back to Rehearsals</Button>
      </div>
    )
  }

  const completedTasks = rehearsal.tasks.filter((t) => t.status === 'closed').length
  const totalTasks = rehearsal.tasks.length
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const handleUpdateTasks = async (tasks: Task[]) => {
    await updateRehearsal({
      ...rehearsal,
      tasks,
      updatedAt: Date.now(),
    })
  }

  const handleUpdateNotes = async (notes: Note[]) => {
    await updateRehearsal({
      ...rehearsal,
      notes,
      updatedAt: Date.now(),
    })
  }

  const handleDelete = async () => {
    if (window.confirm(`Delete "${rehearsal.eventName}"? This cannot be undone.`)) {
      await deleteRehearsal(rehearsal.id)
      navigate('/rehearsals')
    }
  }

  const handleDuplicate = async () => {
    await duplicateRehearsal(rehearsal.id)
    navigate('/rehearsals')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{rehearsal.eventName}</h1>
              {rehearsal.templateId && (
                <Badge variant="info" size="sm">
                  From Template
                </Badge>
              )}
            </div>
            <p className="text-lg opacity-80">
              {fmtDate(rehearsal.date, 'EEEE, MMMM d, yyyy')} at{' '}
              {fmtDate(rehearsal.date, 'h:mm a')}
            </p>
            {rehearsal.location && (
              <p className="text-sm opacity-60 mt-1">{rehearsal.location}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDuplicate}
            >
              Duplicate
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate('/rehearsals')}
            >
              Back
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="opacity-60">Overall Progress</span>
            <span className="font-medium">
              {completedTasks}/{totalTasks} tasks ({completionPercentage}%)
            </span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-success transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Kanban Board */}
        <div className="lg:col-span-2">
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Tasks</h2>
            <KanbanBoard tasks={rehearsal.tasks} onUpdateTasks={handleUpdateTasks} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass rounded-xl p-6">
            <NotesSection
              notes={rehearsal.notes || []}
              onUpdateNotes={handleUpdateNotes}
            />
          </div>

          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="opacity-60">Created</span>
                <span>{new Date(rehearsal.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Last updated</span>
                <span>{new Date(rehearsal.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Total tasks</span>
                <span>{totalTasks}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Completed</span>
                <span>{completedTasks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
