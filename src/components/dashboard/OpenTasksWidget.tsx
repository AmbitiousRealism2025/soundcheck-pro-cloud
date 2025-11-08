import { Link } from 'react-router-dom'
import { useRehearsals } from '@/store/hooks'
import { Card } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/Checkbox'
import type { Rehearsal, Task } from '@/types'

interface TaskWithRehearsal extends Task {
  rehearsal: Rehearsal
}

/**
 * Widget showing open tasks across all rehearsals
 */
export function OpenTasksWidget() {
  const { rehearsals, updateRehearsal } = useRehearsals()

  // Collect all open tasks from all rehearsals
  const openTasks: TaskWithRehearsal[] = rehearsals.flatMap((rehearsal) =>
    rehearsal.tasks
      .filter((task) => task.status === 'open')
      .map((task) => ({ ...task, rehearsal }))
  )

  const handleToggleTask = async (task: TaskWithRehearsal, e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking checkbox

    const updatedTasks = task.rehearsal.tasks.map((t) =>
      t.id === task.id ? { ...t, status: 'closed' as const } : t
    )

    await updateRehearsal({
      ...task.rehearsal,
      tasks: updatedTasks,
    })
  }

  return (
    <Card title="Open Tasks" subtitle={`${openTasks.length} remaining`}>
      {openTasks.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm opacity-60 mb-4">All caught up! 🎉</p>
          <Link
            to="/rehearsals"
            className="text-primary text-sm font-medium hover:underline"
          >
            View rehearsals →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {openTasks.slice(0, 8).map((task) => (
            <Link
              key={`${task.rehearsal.id}-${task.id}`}
              to={`/rehearsals/${task.rehearsal.id}`}
              className="block p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  <Checkbox
                    checked={false}
                    onChange={(e) => handleToggleTask(task, e as any)}
                    aria-label={`Mark "${task.title}" as complete`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <p className="text-xs opacity-60 truncate">
                    {task.rehearsal.eventName}
                  </p>
                  {task.note && (
                    <p className="text-xs opacity-40 mt-1 line-clamp-1">
                      {task.note}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
          {openTasks.length > 8 && (
            <Link
              to="/rehearsals"
              className="block text-center text-sm text-primary py-2 hover:underline"
            >
              View {openTasks.length - 8} more tasks →
            </Link>
          )}
        </div>
      )}
    </Card>
  )
}
