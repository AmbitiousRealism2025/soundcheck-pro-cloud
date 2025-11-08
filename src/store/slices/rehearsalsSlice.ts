import type { StateCreator } from 'zustand'
import type { Rehearsal } from '@/types'
import { db } from '@/db/db'

export interface RehearsalsState {
  rehearsals: Rehearsal[]
  loading: boolean
  error: string | null
}

export interface RehearsalsActions {
  loadRehearsals: () => Promise<void>
  addRehearsal: (rehearsal: Rehearsal) => Promise<void>
  updateRehearsal: (rehearsal: Rehearsal) => Promise<void>
  deleteRehearsal: (id: string) => Promise<void>
  duplicateRehearsal: (id: string) => Promise<void>
  // Selectors
  selectRehearsalById: (id: string) => Rehearsal | undefined
  selectUpcomingRehearsals: () => Rehearsal[]
  selectRehearsalsByDateRange: (start: string, end: string) => Rehearsal[]
}

export type RehearsalsSlice = RehearsalsState & RehearsalsActions

export const createRehearsalsSlice: StateCreator<
  RehearsalsSlice,
  [],
  [],
  RehearsalsSlice
> = (set, get) => ({
  // Initial state
  rehearsals: [],
  loading: false,
  error: null,

  // Actions
  loadRehearsals: async () => {
    set({ loading: true, error: null })
    try {
      const rehearsals = await db.rehearsals.toArray()
      set({ rehearsals, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load rehearsals'
      set({ error: errorMessage, loading: false })
      console.error('Error loading rehearsals:', error)
    }
  },

  addRehearsal: async (rehearsal) => {
    // Optimistic update
    const previousRehearsals = get().rehearsals
    set({
      rehearsals: [...previousRehearsals, rehearsal],
      error: null
    })

    try {
      await db.rehearsals.put(rehearsal)
    } catch (error) {
      // Rollback on error
      set({ rehearsals: previousRehearsals })
      const errorMessage = error instanceof Error ? error.message : 'Failed to add rehearsal'
      set({ error: errorMessage })
      console.error('Error adding rehearsal:', error)
      throw error
    }
  },

  updateRehearsal: async (rehearsal) => {
    // Optimistic update
    const previousRehearsals = get().rehearsals
    set({
      rehearsals: previousRehearsals.map(r => r.id === rehearsal.id ? rehearsal : r),
      error: null
    })

    try {
      await db.rehearsals.put(rehearsal)
    } catch (error) {
      // Rollback on error
      set({ rehearsals: previousRehearsals })
      const errorMessage = error instanceof Error ? error.message : 'Failed to update rehearsal'
      set({ error: errorMessage })
      console.error('Error updating rehearsal:', error)
      throw error
    }
  },

  deleteRehearsal: async (id) => {
    // Optimistic update
    const previousRehearsals = get().rehearsals
    set({
      rehearsals: previousRehearsals.filter(r => r.id !== id),
      error: null
    })

    try {
      await db.rehearsals.delete(id)
    } catch (error) {
      // Rollback on error
      set({ rehearsals: previousRehearsals })
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete rehearsal'
      set({ error: errorMessage })
      console.error('Error deleting rehearsal:', error)
      throw error
    }
  },

  duplicateRehearsal: async (id) => {
    const original = get().selectRehearsalById(id)
    if (!original) {
      const errorMessage = 'Rehearsal not found'
      set({ error: errorMessage })
      throw new Error(errorMessage)
    }

    const duplicate: Rehearsal = {
      ...original,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventName: `${original.eventName} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    await get().addRehearsal(duplicate)
  },

  // Selectors
  selectRehearsalById: (id) => {
    return get().rehearsals.find(r => r.id === id)
  },

  selectUpcomingRehearsals: () => {
    const now = new Date().toISOString()
    return get().rehearsals
      .filter(r => r.date >= now)
      .sort((a, b) => a.date.localeCompare(b.date))
  },

  selectRehearsalsByDateRange: (start, end) => {
    return get().rehearsals
      .filter(r => r.date >= start && r.date <= end)
      .sort((a, b) => a.date.localeCompare(b.date))
  },
})
