import type { StateCreator } from 'zustand'

export type Theme = 'auto' | 'light' | 'dark'

export interface UIState {
  sidebarOpen: boolean
  commandPaletteOpen: boolean
  theme: Theme
  activeModal: string | null
}

export interface UIActions {
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openCommandPalette: () => void
  closeCommandPalette: () => void
  setTheme: (theme: Theme) => void
  openModal: (modalId: string) => void
  closeModal: () => void
}

export type UISlice = UIState & UIActions

const THEME_STORAGE_KEY = 'soundcheck-theme'
export const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)'

const isValidTheme = (value: unknown): value is Theme =>
  value === 'auto' || value === 'light' || value === 'dark'

export const readStoredTheme = (): Theme | null => {
  if (typeof localStorage === 'undefined') {
    return null
  }

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (isValidTheme(stored)) {
      return stored
    }
    return null
  } catch {
    return null
  }
}

const persistTheme = (theme: Theme) => {
  if (typeof localStorage === 'undefined') {
    return
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // no-op: storage may be unavailable
  }
}

const prefersDarkMode = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches
}

export const applyThemeToDocument = (theme: Theme, options?: { prefersDark?: boolean }) => {
  if (typeof document === 'undefined') {
    return
  }

  const prefersDark =
    options?.prefersDark ?? (theme === 'auto' ? prefersDarkMode() : theme === 'dark')

  const resolvedTheme =
    theme === 'auto' ? (prefersDark ? 'dark' : 'light') : theme

  document.documentElement.setAttribute('data-theme', resolvedTheme)
}

export const createUISlice: StateCreator<
  UISlice,
  [],
  [],
  UISlice
> = (set, get) => ({
  // Initial state
  sidebarOpen: true,
  commandPaletteOpen: false,
  theme: 'auto',
  activeModal: null,

  // Actions
  toggleSidebar: () => {
    set({ sidebarOpen: !get().sidebarOpen })
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open })
  },

  openCommandPalette: () => {
    set({ commandPaletteOpen: true })
  },

  closeCommandPalette: () => {
    set({ commandPaletteOpen: false })
  },

  setTheme: (theme) => {
    set({ theme })
    persistTheme(theme)
    applyThemeToDocument(theme)
  },

  openModal: (modalId) => {
    set({ activeModal: modalId })
  },

  closeModal: () => {
    set({ activeModal: null })
  },
})
