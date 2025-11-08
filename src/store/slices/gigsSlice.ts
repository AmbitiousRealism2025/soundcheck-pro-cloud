import type { StateCreator } from 'zustand'
import type { Gig } from '@/types'
import { db } from '@/db/db'

export interface GigsState {
  gigs: Gig[]
  loading: boolean
  error: string | null
}

export interface GigsActions {
  loadGigs: () => Promise<void>
  addGig: (gig: Gig) => Promise<void>
  updateGig: (gig: Gig) => Promise<void>
  deleteGig: (id: string) => Promise<void>
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
  loading: false,
  error: null,

  // Actions
  loadGigs: async () => {
    set({ loading: true, error: null })
    try {
      const gigs = await db.gigs.toArray()
      set({ gigs, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load gigs'
      set({ error: errorMessage, loading: false })
      console.error('Error loading gigs:', error)
    }
  },

  addGig: async (gig) => {
    // Optimistic update
    const previousGigs = get().gigs
    set({
      gigs: [...previousGigs, gig],
      error: null
    })

    try {
      await db.gigs.put(gig)
    } catch (error) {
      // Rollback on error
      set({ gigs: previousGigs })
      const errorMessage = error instanceof Error ? error.message : 'Failed to add gig'
      set({ error: errorMessage })
      console.error('Error adding gig:', error)
      throw error
    }
  },

  updateGig: async (gig) => {
    // Optimistic update
    const previousGigs = get().gigs
    set({
      gigs: previousGigs.map(g => g.id === gig.id ? gig : g),
      error: null
    })

    try {
      await db.gigs.put(gig)
    } catch (error) {
      // Rollback on error
      set({ gigs: previousGigs })
      const errorMessage = error instanceof Error ? error.message : 'Failed to update gig'
      set({ error: errorMessage })
      console.error('Error updating gig:', error)
      throw error
    }
  },

  deleteGig: async (id) => {
    // Optimistic update
    const previousGigs = get().gigs
    set({
      gigs: previousGigs.filter(g => g.id !== id),
      error: null
    })

    try {
      await db.gigs.delete(id)
    } catch (error) {
      // Rollback on error
      set({ gigs: previousGigs })
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete gig'
      set({ error: errorMessage })
      console.error('Error deleting gig:', error)
      throw error
    }
  },

  // Selectors
  selectGigById: (id) => {
    return get().gigs.find(g => g.id === id)
  },

  selectUpcomingGigs: () => {
    const now = new Date().toISOString()
    return get().gigs
      .filter(g => g.date >= now)
      .sort((a, b) => a.date.localeCompare(b.date))
  },

  selectGigsByMonth: (year, month) => {
    return get().gigs
      .filter(g => {
        const gigDate = new Date(g.date)
        return gigDate.getFullYear() === year && gigDate.getMonth() === month
      })
      .sort((a, b) => a.date.localeCompare(b.date))
  },
})
