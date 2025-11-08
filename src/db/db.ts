import Dexie, { Table } from 'dexie'
import type { Rehearsal, Gig, RehearsalTemplate, MileageLog, Compensation } from '@/types'

export class SoundCheckDB extends Dexie {
  rehearsals!: Table<Rehearsal, string>
  gigs!: Table<Gig, string>
  rehearsalTemplates!: Table<RehearsalTemplate, string>
  mileageLogs!: Table<MileageLog, string>

  constructor() {
    super('soundcheck-pro-db')

    // Version 1 - Original schema
    this.version(1).stores({
      rehearsals: 'id, date, eventName, updatedAt',
      gigs: 'id, date, venue.name, updatedAt',
    })

    // Version 2 - Enhanced schema with new tables and migrations
    this.version(2)
      .stores({
        rehearsals: 'id, date, eventName, updatedAt, templateId',
        gigs: 'id, date, status, updatedAt',
        rehearsalTemplates: 'id, name',
        mileageLogs: 'id, gigId, date',
      })
      .upgrade(async (tx) => {
        // Migrate existing rehearsals
        const rehearsals = await tx.table('rehearsals').toArray()
        for (const rehearsal of rehearsals) {
          const updated = {
            ...rehearsal,
            attachments: rehearsal.attachments || [],
            notes: rehearsal.notes || [],
            updatedAt: rehearsal.updatedAt || Date.now(),
          }
          await tx.table('rehearsals').put(updated)
        }

        // Migrate existing gigs - transform compensation from number to object
        const gigs = await tx.table('gigs').toArray()
        for (const gig of gigs) {
          const updated = {
            ...gig,
            status: 'confirmed' as const,
            attachments: gig.attachments || [],
            // Transform old compensation number to new Compensation object
            compensation:
              typeof gig.compensation === 'number'
                ? ({
                    amount: gig.compensation,
                    currency: 'USD',
                    status: 'pending' as const,
                  } as Compensation)
                : gig.compensation,
            updatedAt: gig.updatedAt || Date.now(),
          }
          await tx.table('gigs').put(updated)
        }

        console.log('Database migrated to version 2')
      })
  }
}

export const db = new SoundCheckDB()
