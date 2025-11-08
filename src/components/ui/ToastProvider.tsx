import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { Portal } from './Portal'
import { Toast } from './Toast'

interface ToastItem {
  id: string
  variant: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

interface ToastContextType {
  toast: {
    success: (message: string, duration?: number) => void
    error: (message: string, duration?: number) => void
    warning: (message: string, duration?: number) => void
    info: (message: string, duration?: number) => void
  }
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

/**
 * Toast Provider component
 * Manages toast notifications queue and rendering
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback(
    (variant: ToastItem['variant'], message: string, duration?: number) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const newToast: ToastItem = { id, variant, message, duration }
      setToasts((prev) => [...prev, newToast])
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const contextValue: ToastContextType = {
    toast: {
      success: (message, duration) => addToast('success', message, duration),
      error: (message, duration) => addToast('error', message, duration),
      warning: (message, duration) => addToast('warning', message, duration),
      info: (message, duration) => addToast('info', message, duration),
    },
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Toast container */}
      {toasts.length > 0 && (
        <Portal>
          <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
              <div key={toast.id} className="pointer-events-auto">
                <Toast
                  id={toast.id}
                  variant={toast.variant}
                  message={toast.message}
                  duration={toast.duration}
                  onClose={removeToast}
                />
              </div>
            ))}
          </div>
        </Portal>
      )}
    </ToastContext.Provider>
  )
}

/**
 * Hook to use toast notifications
 * Must be used within ToastProvider
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context.toast
}
