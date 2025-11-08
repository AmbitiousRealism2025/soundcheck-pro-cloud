import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

/**
 * Provider component that initializes global keyboard shortcuts
 * This component doesn't render anything, it just sets up event listeners
 */
export function KeyboardShortcutsProvider() {
  useKeyboardShortcuts()
  return null
}
