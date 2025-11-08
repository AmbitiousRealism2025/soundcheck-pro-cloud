import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createRehearsalsSlice, type RehearsalsSlice } from './slices/rehearsalsSlice'
import { createGigsSlice, type GigsSlice } from './slices/gigsSlice'
import { createUISlice, type UISlice } from './slices/uiSlice'
import { createSettingsSlice, type SettingsSlice } from './slices/settingsSlice'
import type { MileageLog } from '@/types'
import { db } from '@/db/db'

// Combined store type
export type StoreState = RehearsalsSlice & GigsSlice & UISlice & SettingsSlice & {
  // Mileage logs
  mileageLogs: MileageLog[]
  loadMileageLogs: () => Promise<void>
  resetMileageLogs: () => void
  // Legacy compatibility - load all data at once
  loaded: boolean
  load: () => Promise<void>
  // Reset all state
  resetAll: () => void
}

export const useStore = create<StoreState>()(
  devtools(
    (set, get, api) => ({
      // Combine all slices
      ...createRehearsalsSlice(set, get, api),
      ...createGigsSlice(set, get, api),
      ...createUISlice(set, get, api),
      ...createSettingsSlice(set, get, api),

      // Mileage logs
      mileageLogs: [],
      loadMileageLogs: async () => {
        try {
          const logs = await db.mileageLogs.toArray()
          set({ mileageLogs: logs })
        } catch (error) {
          console.error('Error loading mileage logs:', error)
        }
      },
      resetMileageLogs: () => {
        set({ mileageLogs: [] })
      },

      // Legacy compatibility
      loaded: false,
      load: async () => {
        await Promise.all([
          get().loadRehearsals(),
          get().loadGigs(),
          get().loadMileageLogs(),
        ])
        set({ loaded: true })
      },

      // Reset all state to initial values
      resetAll: () => {
        get().resetRehearsals()
        get().resetGigs()
        get().resetMileageLogs()
        set({ loaded: false })
      },
    }),
    {
      name: 'soundcheck-store',
      enabled: import.meta.env.DEV,
    }
  )
)

// Export types for convenience
export type { RehearsalsSlice, GigsSlice, UISlice, SettingsSlice }
