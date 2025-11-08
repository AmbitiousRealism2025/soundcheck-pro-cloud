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

// Load theme from localStorage
const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem('soundcheck-theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }
  return 'auto'
}

// Apply theme to document
const applyTheme = (theme: Theme) => {
  localStorage.setItem('soundcheck-theme', theme)

  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  } else {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

export const createUISlice: StateCreator<
  UISlice,
  [],
  [],
  UISlice
> = (set, get) => {
  // Initialize theme
  const initialTheme = getInitialTheme()
  applyTheme(initialTheme)

  // Listen for system theme changes when theme is 'auto'
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (get().theme === 'auto') {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
    }
  })

  return {
    // Initial state
    sidebarOpen: true,
    commandPaletteOpen: false,
    theme: initialTheme,
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
      applyTheme(theme)
    },

    openModal: (modalId) => {
      set({ activeModal: modalId })
    },

    closeModal: () => {
      set({ activeModal: null })
    },
  }
}
