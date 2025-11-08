import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { useFormValidation } from '@/hooks/useFormValidation'
import { updateTaskSchema, type UpdateTaskFormData } from '@/schemas/taskSchema'
import type { Task } from '@/types'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useState } from 'react'

interface TaskDetailModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
  onSave: (task: Task) => void
  onDelete: (taskId: string) => void
}

/**
 * Modal for editing task details
 */
export function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onSave,
  onDelete,
}: TaskDetailModalProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useFormValidation(updateTaskSchema, {
    defaultValues: task || undefined,
  })

  const status = watch('status')

  const onSubmit = (data: UpdateTaskFormData) => {
    if (task) {
      onSave({ ...task, ...data })
      onClose()
    }
  }

  const handleRequestDelete = () => {
    if (task) {
      setDeleteDialogOpen(true)
    }
  }

  const handleConfirmDelete = () => {
    if (task) {
      onDelete(task.id)
      setDeleteDialogOpen(false)
      onClose()
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
  }

  if (!task) return null

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Edit Task"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Title"
          {...register('title')}
          error={errors.title?.message}
        />

        <Textarea
          label="Notes"
          {...register('note')}
          error={errors.note?.message}
          placeholder="Add any notes or details..."
          rows={4}
        />

        <div>
          <span
            id="task-status-label"
            className="text-sm opacity-80 mb-2 block"
          >
            Status
          </span>
          <SegmentedControl
            options={[
              { value: 'open', label: 'Open' },
              { value: 'closed', label: 'Done' },
            ]}
            value={status || 'open'}
            onChange={(value) => setValue('status', value as 'open' | 'closed')}
            aria-labelledby="task-status-label"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="danger"
            onClick={handleRequestDelete}
          >
            Delete
          </Button>
          <div className="flex-1" />
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete task?"
        description={
          <p>
            This will permanently delete this task from the rehearsal.
          </p>
        }
        confirmLabel="Delete task"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Modal>
  )
}
