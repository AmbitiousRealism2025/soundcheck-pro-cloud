import { PropsWithChildren, useEffect, useRef } from 'react'
import { useUI } from '@/store/hooks'
import {
  applyThemeToDocument,
  DARK_MODE_MEDIA_QUERY,
  readStoredTheme,
  type Theme,
} from '@/store/slices/uiSlice'

export function UIProvider({ children }: PropsWithChildren): JSX.Element {
  const { theme, setTheme } = useUI()
  const themeRef = useRef<Theme>(theme)

  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  // Hydrate theme from storage once the app mounts in the browser
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const storedTheme = readStoredTheme()
    if (storedTheme && storedTheme !== themeRef.current) {
      setTheme(storedTheme)
    } else {
      applyThemeToDocument(themeRef.current)
    }
  }, [setTheme])

  // React to system theme changes when theme preference is set to auto
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const mediaQuery = window.matchMedia(DARK_MODE_MEDIA_QUERY)
    const handleChange = (event: MediaQueryListEvent) => {
      if (themeRef.current === 'auto') {
        applyThemeToDocument('auto', { prefersDark: event.matches })
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return <>{children}</>
}
