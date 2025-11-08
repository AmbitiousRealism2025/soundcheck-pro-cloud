import { ReactNode } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'

export interface ConfirmDialogProps {
  open: boolean
  title?: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'primary' | 'danger' | 'secondary'
  isConfirming?: boolean
  disableConfirm?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Accessible confirmation dialog built on top of Modal.
 * Use for destructive or high-impact actions instead of window.confirm.
 */
export function ConfirmDialog({
  open,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
  isConfirming = false,
  disableConfirm = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={isConfirming ? () => {} : onCancel}
      title={title}
      closeOnBackdrop={!isConfirming}
    >
      <div className="space-y-4">
        {description && (
          <div className="text-sm text-foreground/80">
            {description}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isConfirming}
            data-testid="confirm-dialog-cancel"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isConfirming || disableConfirm}
            data-testid="confirm-dialog-confirm"
          >
            {isConfirming ? 'Working...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}