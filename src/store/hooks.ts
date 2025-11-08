import { useStore } from './useStore'
import { shallow } from 'zustand/shallow'
import type { Rehearsal, Gig } from '@/types'
import type { Settings } from './slices/settingsSlice'

/**
 * Hook to get rehearsals state and actions
 * Optimized with shallow equality to prevent unnecessary re-renders
 */
export const useRehearsals = () => {
  return useStore(
    (state) => ({
      rehearsals: state.rehearsals,
      loading: state.loading,
      error: state.error,
      loadRehearsals: state.loadRehearsals,
      addRehearsal: state.addRehearsal,
      updateRehearsal: state.updateRehearsal,
      deleteRehearsal: state.deleteRehearsal,
      duplicateRehearsal: state.duplicateRehearsal,
      selectRehearsalById: state.selectRehearsalById,
      selectUpcomingRehearsals: state.selectUpcomingRehearsals,
      selectRehearsalsByDateRange: state.selectRehearsalsByDateRange,
    }),
    shallow
  )
}

/**
 * Hook to get gigs state and actions
 * Optimized with shallow equality to prevent unnecessary re-renders
 */
export const useGigs = () => {
  return useStore(
    (state) => ({
      gigs: state.gigs,
      loading: state.loading,
      error: state.error,
      loadGigs: state.loadGigs,
      addGig: state.addGig,
      updateGig: state.updateGig,
      deleteGig: state.deleteGig,
      selectGigById: state.selectGigById,
      selectUpcomingGigs: state.selectUpcomingGigs,
      selectGigsByMonth: state.selectGigsByMonth,
    }),
    shallow
  )
}

/**
 * Hook to get UI state and actions
 */
export const useUI = () => {
  return useStore(
    (state) => ({
      sidebarOpen: state.sidebarOpen,
      commandPaletteOpen: state.commandPaletteOpen,
      theme: state.theme,
      activeModal: state.activeModal,
      toggleSidebar: state.toggleSidebar,
      setSidebarOpen: state.setSidebarOpen,
      openCommandPalette: state.openCommandPalette,
      closeCommandPalette: state.closeCommandPalette,
      setTheme: state.setTheme,
      openModal: state.openModal,
      closeModal: state.closeModal,
    }),
    shallow
  )
}

/**
 * Hook to get settings state and actions
 */
export const useSettings = (): {
  settings: Settings
  updateSettings: (updates: Partial<Settings>) => void
  resetSettings: () => void
} => {
  return useStore(
    (state) => ({
      settings: state.settings,
      updateSettings: state.updateSettings,
      resetSettings: state.resetSettings,
    }),
    shallow
  )
}

/**
 * Hook to get upcoming events (both rehearsals and gigs)
 * Returns a combined, sorted list of upcoming events
 */
export const useUpcomingEvents = (): Array<
  (Rehearsal | Gig) & { type: 'rehearsal' | 'gig' }
> => {
  return useStore((state) => {
    const upcomingRehearsals = state.selectUpcomingRehearsals().map((r) => ({
      ...r,
      type: 'rehearsal' as const,
    }))

    const upcomingGigs = state.selectUpcomingGigs().map((g) => ({
      ...g,
      type: 'gig' as const,
    }))

    return [...upcomingRehearsals, ...upcomingGigs].sort((a, b) =>
      a.date.localeCompare(b.date)
    )
  })
}

/**
 * Hook to get a specific rehearsal by ID
 */
export const useRehearsalById = (id: string): Rehearsal | undefined => {
  return useStore((state) => state.selectRehearsalById(id))
}

/**
 * Hook to get a specific gig by ID
 */
export const useGigById = (id: string): Gig | undefined => {
  return useStore((state) => state.selectGigById(id))
}
