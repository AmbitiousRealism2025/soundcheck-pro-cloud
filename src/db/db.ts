import Dexie, { Table } from 'dexie'
import type { Rehearsal, Gig } from '@/types'

export class SoundCheckDB extends Dexie {
  rehearsals!: Table<Rehearsal, string>
  gigs!: Table<Gig, string>

  constructor() {
    super('soundcheck-pro-db')
    this.version(1).stores({
      rehearsals: 'id, date, eventName, updatedAt',
      gigs: 'id, date, venue.name, updatedAt',
    })
  }
}

export const db = new SoundCheckDB()
