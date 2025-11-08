import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export function UpdateNotification() {
  const [showNotification, setShowNotification] = useState(false)

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      console.log('Service Worker registered:', registration)
    },
    onRegisterError(error) {
      console.error('Service Worker registration error:', error)
    },
  })

  useEffect(() => {
    if (needRefresh) {
      setShowNotification(true)
    }
  }, [needRefresh])

  const handleUpdate = async () => {
    setShowNotification(false)
    await updateServiceWorker(true)
  }

  const handleDismiss = () => {
    setShowNotification(false)
    setNeedRefresh(false)
  }

  if (!showNotification) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md rounded-lg bg-white p-4 shadow-xl ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Update available
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            A new version of SoundCheck Pro is available. Refresh to get the latest features and improvements.
          </p>

          <div className="mt-3 flex gap-3">
            <button
              onClick={handleUpdate}
              className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Update Now
            </button>
            <button
              onClick={handleDismiss}
              className="rounded px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Later
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="flex-shrink-0 rounded p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-label="Dismiss notification"
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
