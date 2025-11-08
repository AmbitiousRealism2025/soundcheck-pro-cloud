import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { useFormValidation } from '@/hooks/useFormValidation'
import { updateTaskSchema } from '@/schemas/taskSchema'
import type { Task } from '@/types'

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

  const onSubmit = (data: any) => {
    if (task) {
      onSave({ ...task, ...data })
      onClose()
    }
  }

  const handleDelete = () => {
    if (task && window.confirm('Delete this task?')) {
      onDelete(task.id)
      onClose()
    }
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
          <label className="text-sm opacity-80 mb-2 block">Status</label>
          <SegmentedControl
            options={[
              { value: 'open', label: 'Open' },
              { value: 'closed', label: 'Done' },
            ]}
            value={status || 'open'}
            onChange={(value) => setValue('status', value as 'open' | 'closed')}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
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
    </Modal>
  )
}
