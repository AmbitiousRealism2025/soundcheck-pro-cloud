import { db } from './db'

export interface MigrationHistory {
  version: number
  timestamp: number
  success: boolean
  error?: string
}

/**
 * Get migration history from localStorage
 */
export const getMigrationHistory = (): MigrationHistory[] => {
  try {
    const history = localStorage.getItem('soundcheck-migration-history')
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('Error loading migration history:', error)
    return []
  }
}

/**
 * Add migration record to history
 */
const addMigrationRecord = (version: number, success: boolean, error?: string) => {
  const history = getMigrationHistory()
  history.push({
    version,
    timestamp: Date.now(),
    success,
    error,
  })
  localStorage.setItem('soundcheck-migration-history', JSON.stringify(history))
}

/**
 * Migrate to v2 schema
 * This is handled automatically by Dexie, but this function provides
 * a way to check migration status or manually trigger if needed
 */
export const migrateToV2 = async (): Promise<boolean> => {
  try {
    // Open the database - this will trigger migrations if needed
    await db.open()
    const currentVersion = db.verno

    if (currentVersion >= 2) {
      console.log('Database is already at version 2 or higher')
      addMigrationRecord(2, true)
      return true
    }

    console.warn('Database version is lower than 2. Automatic upgrade should have occurred.')
    addMigrationRecord(2, false, 'Version check failed')
    return false
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error during migration to v2:', error)
    addMigrationRecord(2, false, errorMessage)
    return false
  }
}

/**
 * Check current database version
 */
export const getDatabaseVersion = async (): Promise<number> => {
  try {
    await db.open()
    return db.verno
  } catch (error) {
    console.error('Error getting database version:', error)
    return 0
  }
}

/**
 * Clear all migration history
 */
export const clearMigrationHistory = () => {
  localStorage.removeItem('soundcheck-migration-history')
}
