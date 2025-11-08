import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Badge } from '@/components/ui/Badge'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onClick: () => void
}

/**
 * Draggable task card for Kanban board
 */
export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium flex-1">{task.title}</h4>
        <Badge
          variant={task.status === 'closed' ? 'success' : 'default'}
          size="sm"
        >
          {task.status}
        </Badge>
      </div>
      {task.note && (
        <p className="text-xs opacity-60 line-clamp-2">{task.note}</p>
      )}
    </div>
  )
}
