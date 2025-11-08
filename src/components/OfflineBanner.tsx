import { useState } from 'react'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()
  const [isDismissed, setIsDismissed] = useState(false)

  // Reset dismissed state when coming back online
  if (isOnline && isDismissed) {
    setIsDismissed(false)
  }

  if (isOnline || isDismissed) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 px-4 py-3 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="font-medium">You're offline</p>
            <p className="text-sm opacity-90">
              Changes will sync when you reconnect.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="rounded p-1 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Dismiss offline banner"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
