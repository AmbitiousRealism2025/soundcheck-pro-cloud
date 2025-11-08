import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskCard } from './TaskCard'
import { TaskDetailModal } from './TaskDetailModal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Task } from '@/types'
import { uid } from '@/utils/id'

interface KanbanBoardProps {
  tasks: Task[]
  onUpdateTasks: (tasks: Task[]) => void
}

/**
 * Kanban board for managing rehearsal tasks
 */
export function KanbanBoard({ tasks, onUpdateTasks }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [addingTo, setAddingTo] = useState<'open' | 'closed' | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const openTasks = tasks.filter((t) => t.status === 'open')
  const closedTasks = tasks.filter((t) => t.status === 'closed')

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    // Determine new status based on drop zone
    const newStatus = over.id === 'open' ? 'open' : 'closed'

    if (task.status !== newStatus) {
      const updatedTasks = tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus as 'open' | 'closed' } : t
      )
      onUpdateTasks(updatedTasks)
    }
  }

  const handleAddTask = (status: 'open' | 'closed') => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: uid('task'),
      title: newTaskTitle,
      status,
      order: tasks.filter((t) => t.status === status).length,
    }

    onUpdateTasks([...tasks, newTask])
    setNewTaskTitle('')
    setAddingTo(null)
  }

  const handleSaveTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    onUpdateTasks(updatedTasks)
  }

  const handleDeleteTask = (taskId: string) => {
    onUpdateTasks(tasks.filter((t) => t.id !== taskId))
  }

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* To Do Column */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">To Do</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setAddingTo('open')}
              >
                + Add
              </Button>
            </div>

            <SortableContext items={openTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div
                id="open"
                className="space-y-2 min-h-[200px] p-4 rounded-lg bg-white/5 border-2 border-dashed border-white/10"
              >
                {openTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => setEditingTask(task)}
                  />
                ))}

                {addingTo === 'open' && (
                  <div className="p-3 rounded-lg bg-white/10">
                    <Input
                      placeholder="Task title..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddTask('open')
                        if (e.key === 'Escape') setAddingTo(null)
                      }}
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => handleAddTask('open')}>
                        Add
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setAddingTo(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </SortableContext>
          </div>

          {/* Done Column */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Done</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setAddingTo('closed')}
              >
                + Add
              </Button>
            </div>

            <SortableContext items={closedTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div
                id="closed"
                className="space-y-2 min-h-[200px] p-4 rounded-lg bg-white/5 border-2 border-dashed border-white/10"
              >
                {closedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => setEditingTask(task)}
                  />
                ))}

                {addingTo === 'closed' && (
                  <div className="p-3 rounded-lg bg-white/10">
                    <Input
                      placeholder="Task title..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddTask('closed')
                        if (e.key === 'Escape') setAddingTo(null)
                      }}
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => handleAddTask('closed')}>
                        Add
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setAddingTo(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </SortableContext>
          </div>
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} onClick={() => {}} /> : null}
        </DragOverlay>
      </DndContext>

      <TaskDetailModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </>
  )
}
