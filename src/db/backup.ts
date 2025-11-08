import { db } from './db'
import type { Rehearsal, Gig, RehearsalTemplate, MileageLog } from '@/types'

export interface DatabaseBackup {
  version: number
  timestamp: number
  data: {
    rehearsals: Rehearsal[]
    gigs: Gig[]
    rehearsalTemplates: RehearsalTemplate[]
    mileageLogs: MileageLog[]
  }
}

/**
 * Export entire database to JSON
 */
export const exportDatabase = async (): Promise<DatabaseBackup> => {
  try {
    const [rehearsals, gigs, rehearsalTemplates, mileageLogs] = await Promise.all([
      db.rehearsals.toArray(),
      db.gigs.toArray(),
      db.rehearsalTemplates.toArray(),
      db.mileageLogs.toArray(),
    ])

    return {
      version: db.verno,
      timestamp: Date.now(),
      data: {
        rehearsals,
        gigs,
        rehearsalTemplates,
        mileageLogs,
      },
    }
  } catch (error) {
    console.error('Error exporting database:', error)
    throw error
  }
}

/**
 * Import database from JSON
 * WARNING: This will clear existing data before importing
 */
export const importDatabase = async (backup: DatabaseBackup): Promise<void> => {
  try {
    // Clear existing data
    await db.transaction('rw', [db.rehearsals, db.gigs, db.rehearsalTemplates, db.mileageLogs], async () => {
      await Promise.all([
        db.rehearsals.clear(),
        db.gigs.clear(),
        db.rehearsalTemplates.clear(),
        db.mileageLogs.clear(),
      ])

      // Import new data
      await Promise.all([
        db.rehearsals.bulkAdd(backup.data.rehearsals),
        db.gigs.bulkAdd(backup.data.gigs),
        db.rehearsalTemplates.bulkAdd(backup.data.rehearsalTemplates || []),
        db.mileageLogs.bulkAdd(backup.data.mileageLogs || []),
      ])
    })

    console.log('Database imported successfully')
  } catch (error) {
    console.error('Error importing database:', error)
    throw error
  }
}

/**
 * Create a backup and save to localStorage
 */
export const createBackup = async (): Promise<string> => {
  try {
    const backup = await exportDatabase()
    const backupKey = `soundcheck-backup-${backup.timestamp}`
    localStorage.setItem(backupKey, JSON.stringify(backup))

    // Also save the latest backup timestamp
    localStorage.setItem('soundcheck-latest-backup', backupKey)

    return backupKey
  } catch (error) {
    console.error('Error creating backup:', error)
    throw error
  }
}

/**
 * Restore from a backup in localStorage
 */
export const restoreBackup = async (backupKey: string): Promise<void> => {
  try {
    const backupData = localStorage.getItem(backupKey)
    if (!backupData) {
      throw new Error('Backup not found')
    }

    const backup: DatabaseBackup = JSON.parse(backupData)
    await importDatabase(backup)
  } catch (error) {
    console.error('Error restoring backup:', error)
    throw error
  }
}

/**
 * Get all available backups from localStorage
 */
export const getAvailableBackups = (): Array<{ key: string; timestamp: number }> => {
  const backups: Array<{ key: string; timestamp: number }> = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('soundcheck-backup-')) {
      try {
        const data = localStorage.getItem(key)
        if (data) {
          const backup: DatabaseBackup = JSON.parse(data)
          backups.push({ key, timestamp: backup.timestamp })
        }
      } catch (error) {
        console.error(`Error parsing backup ${key}:`, error)
      }
    }
  }

  return backups.sort((a, b) => b.timestamp - a.timestamp)
}

/**
 * Delete a backup from localStorage
 */
export const deleteBackup = (backupKey: string): void => {
  localStorage.removeItem(backupKey)
}

/**
 * Download database as JSON file
 */
export const downloadDatabase = async (filename: string = 'soundcheck-backup.json'): Promise<void> => {
  try {
    const backup = await exportDatabase()
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()

    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading database:', error)
    throw error
  }
}

/**
 * Upload and import database from JSON file
 */
export const uploadDatabase = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string
        const backup: DatabaseBackup = JSON.parse(content)
        await importDatabase(backup)
        resolve()
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

/**
 * Export all data (convenience wrapper for downloadDatabase)
 */
export const exportAllData = async (): Promise<void> => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  await downloadDatabase(`soundcheck-backup-${timestamp}.json`)
}
