import { clsx } from 'clsx'
import { ReactNode, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Portal } from './Portal'

export interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  side?: 'left' | 'right' | 'bottom'
}

/**
 * Sheet (slide-out panel) component
 * Mobile-friendly alternative to modals
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  side = 'right',
}: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const sideStyles = {
    left: 'left-0 top-0 bottom-0 w-80 max-w-[90vw]',
    right: 'right-0 top-0 bottom-0 w-80 max-w-[90vw]',
    bottom: 'bottom-0 left-0 right-0 h-[80vh] max-h-[80vh] rounded-t-xl',
  }

  const animationStyles = {
    left: 'animate-slideIn',
    right: 'animate-slideIn',
    bottom: 'animate-slideIn',
  }

  return (
    <Portal>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={clsx(
          'fixed z-50 bg-background border border-white/10 shadow-xl',
          'flex flex-col',
          sideStyles[side],
          animationStyles[side]
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'sheet-title' : undefined}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          {title && (
            <h2 id="sheet-title" className="text-lg font-semibold">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/5 rounded-lg transition-colors ml-auto"
            aria-label="Close sheet"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4">
          {children}
        </div>
      </div>
    </Portal>
  )
}
