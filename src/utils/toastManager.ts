/**
 * Toast Manager - Standalone toast notification system
 *
 * This module provides a way to show toast notifications from outside React components,
 * such as from Zustand store actions or utility functions.
 */

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface ToastCallback {
  (variant: ToastVariant, message: string, duration?: number): void
}

let toastCallback: ToastCallback | null = null

/**
 * Register the toast callback function
 * This should be called once when the ToastProvider mounts
 */
export const registerToast = (callback: ToastCallback): void => {
  toastCallback = callback
}

/**
 * Unregister the toast callback
 * This should be called when the ToastProvider unmounts
 */
export const unregisterToast = (): void => {
  toastCallback = null
}

/**
 * Show a toast notification
 * Can be called from anywhere in the app
 */
export const showToast = {
  success: (message: string, duration?: number): void => {
    toastCallback?.('success', message, duration)
  },
  error: (message: string, duration?: number): void => {
    toastCallback?.('error', message, duration)
  },
  warning: (message: string, duration?: number): void => {
    toastCallback?.('warning', message, duration)
  },
  info: (message: string, duration?: number): void => {
    toastCallback?.('info', message, duration)
  },
}
