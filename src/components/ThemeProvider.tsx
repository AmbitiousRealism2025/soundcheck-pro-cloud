import { useEffect, ReactNode } from 'react'
import { useStore } from '@/store/useStore'
import { applyThemeToDocument, DARK_MODE_MEDIA_QUERY } from '@/store/slices/uiSlice'

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * ThemeProvider manages theme application and system preference listening
 * Properly handles matchMedia listener lifecycle with cleanup
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useStore((state) => state.theme)

  useEffect(() => {
    // Apply theme initially
    applyThemeToDocument(theme)

    // Listen for system theme changes only when theme is 'auto'
    if (theme !== 'auto') {
      return // No listener needed for light/dark
    }

    const mediaQuery = window.matchMedia(DARK_MODE_MEDIA_QUERY)
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if theme is still 'auto'
      const currentTheme = useStore.getState().theme
      if (currentTheme === 'auto') {
        applyThemeToDocument('auto', { prefersDark: e.matches })
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    // Cleanup listener on unmount or theme change
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  return <>{children}</>
}
