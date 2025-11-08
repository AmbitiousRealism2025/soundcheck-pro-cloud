import type { StateCreator } from 'zustand'
import type { Rehearsal } from '@/types'
import { db } from '@/db/db'
import { compareISO, inRange, isUpcoming } from '@/utils/dateUtils'
import { showToast } from '@/utils/toastManager'

export interface RehearsalsState {
  rehearsals: Rehearsal[]
  rehearsalsLoading: boolean
  rehearsalsError: string | null
}

export interface RehearsalsActions {
  loadRehearsals: () => Promise<void>
  addRehearsal: (rehearsal: Rehearsal) => Promise<void>
  updateRehearsal: (rehearsal: Rehearsal) => Promise<void>
  deleteRehearsal: (id: string) => Promise<void>
  duplicateRehearsal: (id: string) => Promise<void>
  resetRehearsals: () => void
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
  rehearsalsLoading: false,
  rehearsalsError: null,

  // Actions
  loadRehearsals: async () => {
    set({ rehearsalsLoading: true, rehearsalsError: null })
    try {
      const rehearsals = await db.rehearsals.toArray()
      set({ rehearsals, rehearsalsLoading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load rehearsals'
      set({ rehearsalsError: errorMessage, rehearsalsLoading: false })
      console.error('Error loading rehearsals:', error)
      showToast.error(errorMessage)
    }
  },

  addRehearsal: async (rehearsal) => {
    // Optimistic update
    const previousRehearsals = get().rehearsals
    set({
      rehearsals: [...previousRehearsals, rehearsal],
      rehearsalsError: null
    })

    try {
      await db.rehearsals.put(rehearsal)
      showToast.success('Rehearsal added successfully')
    } catch (error) {
      // Rollback on error
      set({ rehearsals: previousRehearsals })
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to add rehearsal'
      set({ rehearsalsError: errorMessage })
      console.error('Error adding rehearsal:', error)
      showToast.error(errorMessage)
      throw error
    }
  },

  updateRehearsal: async (rehearsal) => {
    // Optimistic update
    const previousRehearsals = get().rehearsals
    set({
      rehearsals: previousRehearsals.map((r) =>
        r.id === rehearsal.id ? rehearsal : r
      ),
      rehearsalsError: null
    })

    try {
      await db.rehearsals.put(rehearsal)
      showToast.success('Rehearsal updated successfully')
    } catch (error) {
      // Rollback on error
      set({ rehearsals: previousRehearsals })
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update rehearsal'
      set({ rehearsalsError: errorMessage })
      console.error('Error updating rehearsal:', error)
      showToast.error(errorMessage)
      throw error
    }
  },

  deleteRehearsal: async (id) => {
    // Optimistic update
    const previousRehearsals = get().rehearsals
    set({
      rehearsals: previousRehearsals.filter((r) => r.id !== id),
      rehearsalsError: null
    })

    try {
      await db.rehearsals.delete(id)
      showToast.success('Rehearsal deleted successfully')
    } catch (error) {
      // Rollback on error
      set({ rehearsals: previousRehearsals })
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete rehearsal'
      set({ rehearsalsError: errorMessage })
      console.error('Error deleting rehearsal:', error)
      showToast.error(errorMessage)
      throw error
    }
  },

  duplicateRehearsal: async (id) => {
    const original = get().selectRehearsalById(id)
    if (!original) {
      const errorMessage = 'Rehearsal not found'
      set({ rehearsalsError: errorMessage })
      showToast.error(errorMessage)
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
    showToast.success('Rehearsal duplicated successfully')
  },

  resetRehearsals: () => {
    set({
      rehearsals: [],
      rehearsalsLoading: false,
      rehearsalsError: null,
    })
  },

  // Selectors
  selectRehearsalById: (id) => {
    return get().rehearsals.find(r => r.id === id)
  },

  selectUpcomingRehearsals: () => {
    const now = Date.now()
    return get().rehearsals
      .filter((r) => isUpcoming(r.date, now))
      .sort((a, b) => compareISO(a.date, b.date))
  },

  selectRehearsalsByDateRange: (start, end) => {
    return get().rehearsals
      .filter((r) => inRange(r.date, start, end))
      .sort((a, b) => compareISO(a.date, b.date))
  },
})
