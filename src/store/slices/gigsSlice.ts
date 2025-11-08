import type { StateCreator } from 'zustand'
import type { Gig } from '@/types'
import { db } from '@/db/db'
import { compareISO, isUpcoming } from '@/utils/dateUtils'
import { showToast } from '@/utils/toastManager'

export interface GigsState {
  gigs: Gig[]
  gigsLoading: boolean
  gigsError: string | null
}

export interface GigsActions {
  loadGigs: () => Promise<void>
  addGig: (gig: Gig) => Promise<void>
  updateGig: (gig: Gig) => Promise<void>
  deleteGig: (id: string) => Promise<void>
  resetGigs: () => void
  // Selectors
  selectGigById: (id: string) => Gig | undefined
  selectUpcomingGigs: () => Gig[]
  selectGigsByMonth: (year: number, month: number) => Gig[]
}

export type GigsSlice = GigsState & GigsActions

export const createGigsSlice: StateCreator<
  GigsSlice,
  [],
  [],
  GigsSlice
> = (set, get) => ({
  // Initial state
  gigs: [],
  gigsLoading: false,
  gigsError: null,

  // Actions
  loadGigs: async () => {
    set({ gigsLoading: true, gigsError: null })
    try {
      const gigs = await db.gigs.toArray()
      set({ gigs, gigsLoading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load gigs'
      set({ gigsError: errorMessage, gigsLoading: false })
      console.error('Error loading gigs:', error)
      showToast.error(errorMessage)
    }
  },

  addGig: async (gig) => {
    // Optimistic update
    const previousGigs = get().gigs
    set({
      gigs: [...previousGigs, gig],
      gigsError: null
    })

    try {
      await db.gigs.put(gig)
      showToast.success('Gig added successfully')
    } catch (error) {
      // Rollback on error
      set({ gigs: previousGigs })
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to add gig'
      set({ gigsError: errorMessage })
      console.error('Error adding gig:', error)
      showToast.error(errorMessage)
      throw error
    }
  },

  updateGig: async (gig) => {
    // Optimistic update
    const previousGigs = get().gigs
    set({
      gigs: previousGigs.map((g) => (g.id === gig.id ? gig : g)),
      gigsError: null
    })

    try {
      await db.gigs.put(gig)
      showToast.success('Gig updated successfully')
    } catch (error) {
      // Rollback on error
      set({ gigs: previousGigs })
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update gig'
      set({ gigsError: errorMessage })
      console.error('Error updating gig:', error)
      showToast.error(errorMessage)
      throw error
    }
  },

  deleteGig: async (id) => {
    // Optimistic update
    const previousGigs = get().gigs
    set({
      gigs: previousGigs.filter((g) => g.id !== id),
      gigsError: null
    })

    try {
      await db.gigs.delete(id)
      showToast.success('Gig deleted successfully')
    } catch (error) {
      // Rollback on error
      set({ gigs: previousGigs })
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete gig'
      set({ gigsError: errorMessage })
      console.error('Error deleting gig:', error)
      showToast.error(errorMessage)
      throw error
    }
  },

  resetGigs: () => {
    set({
      gigs: [],
      gigsLoading: false,
      gigsError: null,
    })
  },

  // Selectors
  selectGigById: (id) => {
    return get().gigs.find(g => g.id === id)
  },

  selectUpcomingGigs: () => {
    const now = Date.now()
    return get().gigs
      .filter((g) => isUpcoming(g.date, now))
      .sort((a, b) => compareISO(a.date, b.date))
  },

  selectGigsByMonth: (year, month) => {
    return get().gigs
      .filter((g) => {
        const gigDate = new Date(g.date)
        return gigDate.getFullYear() === year && gigDate.getMonth() === month
      })
      .sort((a, b) => compareISO(a.date, b.date))
  },
})
