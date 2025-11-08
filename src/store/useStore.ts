import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createRehearsalsSlice, type RehearsalsSlice } from './slices/rehearsalsSlice'
import { createGigsSlice, type GigsSlice } from './slices/gigsSlice'
import { createUISlice, type UISlice } from './slices/uiSlice'
import { createSettingsSlice, type SettingsSlice } from './slices/settingsSlice'

// Combined store type
export type StoreState = RehearsalsSlice & GigsSlice & UISlice & SettingsSlice & {
  // Legacy compatibility - load all data at once
  loaded: boolean
  load: () => Promise<void>
}

export const useStore = create<StoreState>()(
  devtools(
    (set, get, api) => ({
      // Combine all slices
      ...createRehearsalsSlice(set, get, api),
      ...createGigsSlice(set, get, api),
      ...createUISlice(set, get, api),
      ...createSettingsSlice(set, get, api),

      // Legacy compatibility
      loaded: false,
      load: async () => {
        await Promise.all([
          get().loadRehearsals(),
          get().loadGigs(),
        ])
        set({ loaded: true })
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
