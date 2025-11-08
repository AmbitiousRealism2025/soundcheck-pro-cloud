import { sanitizeUrlParam } from './sanitize'

export function directionsLink(destination: string, origin?: string) {
  const base = 'https://www.google.com/maps/dir/?api=1'
  const safeDestination = sanitizeUrlParam(destination, 400)
  if (!safeDestination) {
    throw new Error('A valid destination is required for directions link')
  }

  const params = new URLSearchParams({ destination: safeDestination })
  const safeOrigin = sanitizeUrlParam(origin, 400)
  if (safeOrigin) params.set('origin', safeOrigin)
  return `${base}&${params.toString()}`
}

export const openExternal = (url: string): boolean => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('openExternal called outside of a browser-like environment')
    return false
  }

  if (typeof url !== 'string' || !url.trim()) {
    console.warn('openExternal received an empty URL')
    return false
  }

  try {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.target = '_blank'
    anchor.rel = 'noopener noreferrer'
    anchor.click()
    return true
  } catch (error) {
    console.error('Failed to open external link:', error)
    return false
  }
}
