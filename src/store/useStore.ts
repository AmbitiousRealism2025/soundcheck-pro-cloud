import { create } from 'zustand'
import type { Rehearsal, Gig } from '@/types'
import { db } from '@/db/db'

type State = {
  rehearsals: Rehearsal[]
  gigs: Gig[]
  loaded: boolean
  // UI state
  sidebarOpen: boolean
}

type Actions = {
  load: () => Promise<void>
  addRehearsal: (r: Rehearsal) => Promise<void>
  addGig: (g: Gig) => Promise<void>
  updateRehearsal: (r: Rehearsal) => Promise<void>
  updateGig: (g: Gig) => Promise<void>
  // UI actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useStore = create<State & Actions>((set, get) => ({
  rehearsals: [],
  gigs: [],
  loaded: false,
  sidebarOpen: true,
  load: async () => {
    const [rehearsals, gigs] = await Promise.all([
      db.rehearsals.toArray(),
      db.gigs.toArray()
    ])
    set({ rehearsals, gigs, loaded: true })
  },
  addRehearsal: async (r) => {
    await db.rehearsals.put(r)
    set({ rehearsals: [...get().rehearsals, r] })
  },
  addGig: async (g) => {
    await db.gigs.put(g)
    set({ gigs: [...get().gigs, g] })
  },
  updateRehearsal: async (r) => {
    await db.rehearsals.put(r)
    set({ rehearsals: get().rehearsals.map(x => x.id === r.id ? r : x) })
  },
  updateGig: async (g) => {
    await db.gigs.put(g)
    set({ gigs: get().gigs.map(x => x.id === g.id ? g : x) })
  },
  toggleSidebar: () => {
    set({ sidebarOpen: !get().sidebarOpen })
  },
  setSidebarOpen: (open) => {
    set({ sidebarOpen: open })
  },
}))
