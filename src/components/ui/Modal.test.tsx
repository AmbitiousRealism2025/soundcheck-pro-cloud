import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

describe('Modal', () => {
  beforeEach(() => {
    // Clean up body overflow style before each test
    document.body.style.overflow = ''
  })

  describe('Rendering', () => {
    it('should not render when open is false', () => {
      render(
        <Modal open={false} onClose={vi.fn()}>
          <p>Modal content</p>
        </Modal>
      )
      expect(screen.queryByText('Modal content')).not.toBeInTheDocument()
    })

    it('should render when open is true', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <p>Modal content</p>
        </Modal>
      )
      expect(screen.getByText('Modal content')).toBeInTheDocument()
    })

    it('should render with title', () => {
      render(
        <Modal open={true} onClose={vi.fn()} title="Test Modal">
          <p>Content</p>
        </Modal>
      )
      expect(screen.getByText('Test Modal')).toBeInTheDocument()
    })

    it('should render without title', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )
      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })

    it('should render with footer', () => {
      render(
        <Modal open={true} onClose={vi.fn()} footer={<button>Save</button>}>
          <p>Content</p>
        </Modal>
      )
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    })

    it('should render close button when title is provided', () => {
      render(
        <Modal open={true} onClose={vi.fn()} title="Test Modal">
          <p>Content</p>
        </Modal>
      )
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument()
    })
  })

  describe('Sizes', () => {
    it('should apply small size', () => {
      const { container } = render(
        <Modal open={true} onClose={vi.fn()} size="sm">
          <p>Content</p>
        </Modal>
      )
      const modal = container.querySelector('[role="dialog"]')
      expect(modal).toHaveClass('max-w-sm')
    })

    it('should apply medium size (default)', () => {
      const { container } = render(
        <Modal open={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )
      const modal = container.querySelector('[role="dialog"]')
      expect(modal).toHaveClass('max-w-md')
    })

    it('should apply large size', () => {
      const { container } = render(
        <Modal open={true} onClose={vi.fn()} size="lg">
          <p>Content</p>
        </Modal>
      )
      const modal = container.querySelector('[role="dialog"]')
      expect(modal).toHaveClass('max-w-lg')
    })

    it('should apply extra large size', () => {
      const { container } = render(
        <Modal open={true} onClose={vi.fn()} size="xl">
          <p>Content</p>
        </Modal>
      )
      const modal = container.querySelector('[role="dialog"]')
      expect(modal).toHaveClass('max-w-xl')
    })
  })

  describe('Interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      const handleClose = vi.fn()
      const user = userEvent.setup()

      render(
        <Modal open={true} onClose={handleClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      )

      const closeButton = screen.getByLabelText('Close modal')
      await user.click(closeButton)

      expect(handleClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when Escape key is pressed', async () => {
      const handleClose = vi.fn()
      const user = userEvent.setup()

      render(
        <Modal open={true} onClose={handleClose}>
          <p>Content</p>
        </Modal>
      )

      await user.keyboard('{Escape}')
      expect(handleClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when backdrop is clicked and closeOnBackdrop is true', async () => {
      const handleClose = vi.fn()
      const user = userEvent.setup()

      const { container } = render(
        <Modal open={true} onClose={handleClose} closeOnBackdrop={true}>
          <p>Content</p>
        </Modal>
      )

      const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/60')
      if (backdrop) {
        await user.click(backdrop)
        expect(handleClose).toHaveBeenCalledTimes(1)
      }
    })

    it('should not call onClose when backdrop is clicked and closeOnBackdrop is false', async () => {
      const handleClose = vi.fn()
      const user = userEvent.setup()

      const { container } = render(
        <Modal open={true} onClose={handleClose} closeOnBackdrop={false}>
          <p>Content</p>
        </Modal>
      )

      const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/60')
      if (backdrop) {
        await user.click(backdrop)
        expect(handleClose).not.toHaveBeenCalled()
      }
    })
  })

  describe('Body scroll behavior', () => {
    it('should prevent body scroll when modal is open', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('should restore body scroll when modal is closed', () => {
      const { rerender } = render(
        <Modal open={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('hidden')

      rerender(
        <Modal open={false} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('')
    })

    it('should restore body scroll on unmount', () => {
      const { unmount } = render(
        <Modal open={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('hidden')
      unmount()
      expect(document.body.style.overflow).toBe('')
    })
  })

  describe('Accessibility', () => {
    it('should have role="dialog"', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should have aria-modal="true"', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })

    it('should have aria-labelledby when title is provided', () => {
      render(
        <Modal open={true} onClose={vi.fn()} title="Test Modal">
          <p>Content</p>
        </Modal>
      )
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
      expect(screen.getByText('Test Modal')).toHaveAttribute('id', 'modal-title')
    })

    it('should focus first focusable element when opened', async () => {
      render(
        <Modal open={true} onClose={vi.fn()} title="Test Modal">
          <button>First button</button>
          <button>Second button</button>
        </Modal>
      )

      await waitFor(() => {
        const closeButton = screen.getByLabelText('Close modal')
        expect(document.activeElement).toBe(closeButton)
      })
    })
  })

  describe('Content rendering', () => {
    it('should render complex children', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <div>
            <h3>Heading</h3>
            <p>Paragraph</p>
            <input placeholder="Input field" />
          </div>
        </Modal>
      )

      expect(screen.getByRole('heading', { name: /heading/i })).toBeInTheDocument()
      expect(screen.getByText('Paragraph')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Input field')).toBeInTheDocument()
    })

    it('should render multiple buttons in footer', () => {
      render(
        <Modal
          open={true}
          onClose={vi.fn()}
          footer={
            <>
              <button>Cancel</button>
              <button>Save</button>
            </>
          }
        >
          <p>Content</p>
        </Modal>
      )

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    })
  })
})
