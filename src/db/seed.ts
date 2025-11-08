import { db } from './db'
import { uid } from '@/utils/id'
import type { Rehearsal, Gig, RehearsalTemplate, MileageLog } from '@/types'
import { showToast } from '@/utils/toastManager'
import {
  parseDatabaseBackupOrThrow,
  type DatabaseBackup,
  type DatabaseImportSummary,
} from './backup'

/**
 * Generate sample rehearsal data for development
 */
function generateRehearsals(): Rehearsal[] {
  const now = new Date()

  const rehearsal1: Rehearsal = {
    id: uid('reh'),
    eventName: 'Spring Tour Rehearsal',
    date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    location: 'Studio A - Downtown Music Hall',
    tasks: [
      {
        id: uid('task'),
        title: 'Warm up exercises',
        note: '15 min scales and arpeggios',
        status: 'closed',
        order: 0,
      },
      {
        id: uid('task'),
        title: 'Run through setlist',
        note: 'Full setlist from top to bottom, no stops',
        status: 'open',
        order: 1,
      },
      {
        id: uid('task'),
        title: 'Work on transitions',
        note: 'Focus on song endings and segues',
        status: 'open',
        order: 2,
      },
      {
        id: uid('task'),
        title: 'New material',
        note: 'Debut 3 new songs from upcoming album',
        status: 'open',
        order: 3,
      },
    ],
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  }

  const rehearsal2: Rehearsal = {
    id: uid('reh'),
    eventName: 'Jazz Standards Night Prep',
    date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    location: 'The Blue Room',
    tasks: [
      {
        id: uid('task'),
        title: 'Autumn Leaves',
        note: 'Key of Gm, work on intro arrangement',
        status: 'open',
        order: 0,
      },
      {
        id: uid('task'),
        title: 'All The Things You Are',
        note: 'Solo section - 2 choruses each',
        status: 'open',
        order: 1,
      },
      {
        id: uid('task'),
        title: 'My Funny Valentine',
        note: 'Ballad tempo, feature vocalist',
        status: 'open',
        order: 2,
      },
    ],
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  }

  const rehearsal3: Rehearsal = {
    id: uid('reh'),
    eventName: 'Wedding Band Run-through',
    date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (past event)
    location: 'Practice Space #5',
    tasks: [
      {
        id: uid('task'),
        title: 'First dance songs',
        note: 'Can\'t Help Falling in Love, At Last, Thinking Out Loud',
        status: 'closed',
        order: 0,
      },
      {
        id: uid('task'),
        title: 'Top 40 hits',
        note: 'Party songs: Uptown Funk, Shut Up and Dance, etc.',
        status: 'closed',
        order: 1,
      },
      {
        id: uid('task'),
        title: 'Ceremony music',
        note: 'Canon in D, Ave Maria, Bridal March',
        status: 'closed',
        order: 2,
      },
      {
        id: uid('task'),
        title: 'Sound check procedure',
        note: 'Go over mic placement and monitor mixes',
        status: 'closed',
        order: 3,
      },
    ],
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  }

  const rehearsal4: Rehearsal = {
    id: uid('reh'),
    eventName: 'Orchestra Sectional - Strings',
    date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    location: 'Symphony Hall Rehearsal Room',
    tasks: [
      {
        id: uid('task'),
        title: 'Beethoven Symphony No. 5',
        note: 'Movement 1 - measures 1-100',
        status: 'open',
        order: 0,
      },
      {
        id: uid('task'),
        title: 'Intonation work',
        note: 'Unison passages, challenging intervals',
        status: 'open',
        order: 1,
      },
      {
        id: uid('task'),
        title: 'Bowings coordination',
        note: 'Align all bow strokes and articulations',
        status: 'open',
        order: 2,
      },
    ],
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  }

  const rehearsal5: Rehearsal = {
    id: uid('reh'),
    eventName: 'Solo Album Recording Prep',
    date: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks from now
    tasks: [
      {
        id: uid('task'),
        title: 'Track 1: Opening Theme',
        note: 'Final arrangement review',
        status: 'open',
        order: 0,
      },
      {
        id: uid('task'),
        title: 'Track 2: Midnight Drive',
        note: 'Practice guitar solo section',
        status: 'open',
        order: 1,
      },
      {
        id: uid('task'),
        title: 'Track 3: Interlude',
        note: 'Piano and strings only - work on dynamics',
        status: 'open',
        order: 2,
      },
      {
        id: uid('task'),
        title: 'Click track practice',
        note: 'Get comfortable with tempo changes',
        status: 'open',
        order: 3,
      },
    ],
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  }

  return [rehearsal1, rehearsal2, rehearsal3, rehearsal4, rehearsal5]
}

/**
 * Generate sample gig data for development
 */
function generateGigs(): Gig[] {
  const now = new Date()

  const gig1: Gig = {
    id: uid('gig'),
    date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    callTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(), // 2 hours before
    venue: {
      name: 'The Blue Note',
      address: '131 W 3rd St, New York, NY 10012',
      contact: 'booking@bluenote.net',
    },
    compensation: {
      amount: 500,
      currency: 'USD',
      status: 'pending',
    },
    status: 'confirmed',
    notes: 'Jazz trio - 2 sets, bring acoustic bass',
    mileage: 15.5,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  }

  const gig2: Gig = {
    id: uid('gig'),
    date: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
    callTime: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000).toISOString(),
    venue: {
      name: 'Madison Square Garden',
      address: '4 Pennsylvania Plaza, New York, NY 10001',
      contact: 'events@msg.com',
    },
    compensation: {
      amount: 2500,
      currency: 'USD',
      status: 'pending',
    },
    status: 'confirmed',
    notes: 'Opening act for headliner - 45 min set, full production',
    mileage: 8.2,
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  }

  const gig3: Gig = {
    id: uid('gig'),
    date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago (past gig)
    callTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000).toISOString(),
    venue: {
      name: 'Sunset Gardens',
      address: '456 Ocean Ave, Santa Monica, CA 90401',
      contact: 'weddings@sunsetgardens.com',
    },
    compensation: {
      amount: 1200,
      currency: 'USD',
      status: 'paid',
      paidAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      method: 'check',
    },
    status: 'completed',
    notes: 'Wedding reception - 4 hour gig, ceremony + cocktail hour + reception',
    mileage: 42.3,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  }

  const gig4: Gig = {
    id: uid('gig'),
    date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month from now
    venue: {
      name: 'Red Rocks Amphitheatre',
      address: '18300 W Alameda Pkwy, Morrison, CO 80465',
      contact: 'info@redrocksonline.com',
    },
    compensation: {
      amount: 5000,
      currency: 'USD',
      status: 'pending',
    },
    status: 'confirmed',
    notes: 'Festival headliner - 90 min set, outdoor venue, sound check at 3pm',
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  }

  const gig5: Gig = {
    id: uid('gig'),
    date: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 6 weeks from now
    callTime: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
    venue: {
      name: 'Jazz Alley',
      address: '2033 6th Ave, Seattle, WA 98121',
    },
    compensation: {
      amount: 350,
      currency: 'USD',
      status: 'pending',
    },
    status: 'confirmed',
    notes: 'Weekly residency - first night',
    mileage: 22.1,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  }

  const gig6: Gig = {
    id: uid('gig'),
    date: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 2 months from now
    venue: {
      name: 'Carnegie Hall',
      address: '881 7th Ave, New York, NY 10019',
      contact: 'info@carnegiehall.org',
    },
    compensation: {
      amount: 10000,
      currency: 'USD',
      status: 'pending',
    },
    status: 'pending',
    notes: 'Solo recital - prestigious venue, full concert program',
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  }

  const gig7: Gig = {
    id: uid('gig'),
    date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago (past gig)
    venue: {
      name: 'Local Coffee House',
      address: '123 Main St, Anytown, USA',
    },
    compensation: {
      amount: 150,
      currency: 'USD',
      status: 'paid',
      paidAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
      method: 'cash',
    },
    status: 'completed',
    notes: 'Acoustic set - 2 hours, bring own amp',
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
  }

  const gig8: Gig = {
    id: uid('gig'),
    date: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months from now
    callTime: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000).toISOString(),
    venue: {
      name: 'Summer Music Festival',
      address: 'Central Park, New York, NY',
      contact: 'festival@summermusicfest.com',
    },
    status: 'confirmed',
    notes: 'Festival performance - afternoon slot, expect large crowd',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  }

  return [gig1, gig2, gig3, gig4, gig5, gig6, gig7, gig8]
}

/**
 * Seed the database with sample data
 * Clears existing data and populates with fresh sample data
 */
export async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Seeding database...')

    // Clear existing data
    await db.rehearsals.clear()
    await db.gigs.clear()

    // Generate and insert sample data
    const rehearsals = generateRehearsals()
    const gigs = generateGigs()

    await db.rehearsals.bulkAdd(rehearsals)
    await db.gigs.bulkAdd(gigs)

    console.log(`✅ Database seeded successfully!`)
    console.log(`   - ${rehearsals.length} rehearsals`)
    console.log(`   - ${gigs.length} gigs`)
    showToast.success(`Database seeded with ${rehearsals.length} rehearsals and ${gigs.length} gigs`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to seed database'
    console.error('❌ Error seeding database:', error)
    showToast.error(errorMessage)
    throw error
  }
}

/**
 * Clear all data from the database
 */
export async function clearDatabase(): Promise<void> {
  try {
    console.log('🗑️  Clearing database...')
    await db.rehearsals.clear()
    await db.gigs.clear()
    console.log('✅ Database cleared successfully!')
    showToast.success('Database cleared successfully')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to clear database'
    console.error('❌ Error clearing database:', error)
    showToast.error(errorMessage)
    throw error
  }
}

/**
 * Export all data from the database as JSON
 */
export async function exportDatabase(): Promise<string> {
  try {
    console.log('📤 Exporting database...')
    const [rehearsals, gigs, rehearsalTemplates, mileageLogs] = await Promise.all([
      db.rehearsals.toArray(),
      db.gigs.toArray(),
      db.rehearsalTemplates.toArray(),
      db.mileageLogs.toArray(),
    ])

    const backup: DatabaseBackup = {
      version: db.verno,
      timestamp: Date.now(),
      data: {
        rehearsals,
        gigs,
        rehearsalTemplates,
        mileageLogs,
      },
    }

    const json = JSON.stringify(backup, null, 2)
    console.log('✅ Database exported successfully!')
    return json
  } catch (error) {
    console.error('❌ Error exporting database:', error)
    throw error
  }
}

/**
 * Import data into the database from JSON
 */
export async function importDatabase(jsonData: string): Promise<DatabaseImportSummary> {
  try {
    console.log('📥 Importing database...')
    const raw = JSON.parse(jsonData)
    const backup = parseDatabaseBackupOrThrow(raw)
    const { rehearsals, gigs, rehearsalTemplates, mileageLogs } = backup.data
    const summary: DatabaseImportSummary = {
      rehearsals: rehearsals.length,
      gigs: gigs.length,
      rehearsalTemplates: rehearsalTemplates.length,
      mileageLogs: mileageLogs.length,
    }

    await db.transaction(
      'rw',
      [db.rehearsals, db.gigs, db.rehearsalTemplates, db.mileageLogs],
      async () => {
        await Promise.all([
          db.rehearsals.clear(),
          db.gigs.clear(),
          db.rehearsalTemplates.clear(),
          db.mileageLogs.clear(),
        ])

        if (summary.rehearsals) {
          await db.rehearsals.bulkAdd(rehearsals as Rehearsal[])
        }
        if (summary.gigs) {
          await db.gigs.bulkAdd(gigs as Gig[])
        }
        if (summary.rehearsalTemplates) {
          await db.rehearsalTemplates.bulkAdd(rehearsalTemplates as RehearsalTemplate[])
        }
        if (summary.mileageLogs) {
          await db.mileageLogs.bulkAdd(mileageLogs as MileageLog[])
        }
      }
    )

    console.log('✅ Database imported successfully!')
    console.log(`   - ${summary.rehearsals} rehearsals`)
    console.log(`   - ${summary.gigs} gigs`)
    if (summary.rehearsalTemplates) {
      console.log(`   - ${summary.rehearsalTemplates} rehearsal templates`)
    }
    if (summary.mileageLogs) {
      console.log(`   - ${summary.mileageLogs} mileage logs`)
    }
    showToast.success(
      `Database imported: ${summary.rehearsals} rehearsals, ${summary.gigs} gigs`
    )
    return summary
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to import database'
    console.error('❌ Error importing database:', error)
    showToast.error(errorMessage)
    throw error
  }
}
