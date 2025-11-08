import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'

export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  description: string
}

/**
 * Global keyboard shortcuts hook
 * Handles Cmd+K (command palette), Cmd+N (new rehearsal), etc.
 */
export function useKeyboardShortcuts() {
  const navigate = useNavigate()
  const openCommandPalette = useStore(state => state.openCommandPalette)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in input fields
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        // Exception: Cmd+K should work even in input fields
        if (!((e.metaKey || e.ctrlKey) && e.key === 'k')) {
          return
        }
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modKey = isMac ? e.metaKey : e.ctrlKey

      // Cmd/Ctrl + K: Open command palette
      if (modKey && e.key === 'k') {
        e.preventDefault()
        openCommandPalette()
        return
      }

      // Cmd/Ctrl + N: New rehearsal
      if (modKey && e.key === 'n' && !e.shiftKey) {
        e.preventDefault()
        navigate('/rehearsals?new=1')
        return
      }

      // Cmd/Ctrl + Shift + N: New gig
      if (modKey && e.shiftKey && e.key === 'N') {
        e.preventDefault()
        navigate('/gigs?new=1')
        return
      }

      // Cmd/Ctrl + ,: Settings
      if (modKey && e.key === ',') {
        e.preventDefault()
        navigate('/settings')
        return
      }

      // Cmd/Ctrl + /: Help (could show shortcuts modal)
      if (modKey && e.key === '/') {
        e.preventDefault()
        // TODO: Show shortcuts help modal
        console.log('Shortcuts help - to be implemented')
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, openCommandPalette])
}

/**
 * Get all available shortcuts for display
 */
export function getShortcuts(): KeyboardShortcut[] {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const modKey = isMac ? '⌘' : 'Ctrl'

  return [
    {
      key: `${modKey}+K`,
      description: 'Open command palette',
      action: () => {},
    },
    {
      key: `${modKey}+N`,
      description: 'New rehearsal',
      action: () => {},
    },
    {
      key: `${modKey}+Shift+N`,
      description: 'New gig',
      action: () => {},
    },
    {
      key: `${modKey}+,`,
      description: 'Settings',
      action: () => {},
    },
    {
      key: `${modKey}+/`,
      description: 'Show shortcuts',
      action: () => {},
    },
  ]
}
