import { Spinner } from './ui/Spinner'

interface SuspenseFallbackProps {
  message?: string
}

export function SuspenseFallback({ message = 'Loading...' }: SuspenseFallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  )
}

/**
 * Minimal fallback for route-level suspense
 * Matches the app layout structure
 */
export function RouteSuspenseFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <Spinner size="md" />
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading page...</p>
      </div>
    </div>
  )
}
