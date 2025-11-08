import { useEffect, useState } from 'react'

/**
 * Hook to track online/offline status
 * Returns true when online, false when offline
 */
export const useOnlineStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      console.log('Network: Online')
      setIsOnline(true)
    }

    const handleOffline = () => {
      console.log('Network: Offline')
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
