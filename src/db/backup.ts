import { db } from './db'
import { showToast } from '@/utils/toastManager'
import { toSafeFilename } from '@/utils/sanitize'
import { z, type ZodIssue } from 'zod'
import { rehearsalSchema } from '@/schemas/rehearsalSchema'
import { gigSchema } from '@/schemas/gigSchema'
import { taskSchema } from '@/schemas/taskSchema'
import type { Rehearsal, Gig, RehearsalTemplate, MileageLog } from '@/types'

const BACKUP_TABLE_KEYS = ['rehearsals', 'gigs', 'rehearsalTemplates', 'mileageLogs'] as const

export type BackupTableKey = (typeof BACKUP_TABLE_KEYS)[number]

const BACKUP_TABLE_LABELS: Record<BackupTableKey, { singular: string; plural: string }> = {
  rehearsals: { singular: 'rehearsal', plural: 'rehearsals' },
  gigs: { singular: 'gig', plural: 'gigs' },
  rehearsalTemplates: { singular: 'rehearsal template', plural: 'rehearsal templates' },
  mileageLogs: { singular: 'mileage log', plural: 'mileage logs' },
}

const attachmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(255),
  url: z.string().max(2048),
  type: z.string().min(1).max(100),
  size: z.number().int().nonnegative(),
  uploadedAt: z.number().int().nonnegative(),
})

const noteSchema = z.object({
  id: z.string(),
  content: z.string().max(5000),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
})

const taskRecordSchema = taskSchema.extend({
  id: z.string(),
})

const rehearsalRecordSchema = rehearsalSchema.extend({
  id: z.string(),
  tasks: z.array(taskRecordSchema),
  attachments: z.array(attachmentSchema).optional().default([]),
  notes: z.array(noteSchema).optional().default([]),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
})

const gigRecordSchema = gigSchema.extend({
  id: z.string(),
  eventName: z.string().max(150).optional(),
  attachments: z.array(attachmentSchema).optional().default([]),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
})

const rehearsalTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  defaultTasks: z.array(taskSchema).optional().default([]),
  createdAt: z.number().int().nonnegative(),
})

const mileageLogSchema = z.object({
  id: z.string(),
  gigId: z.string(),
  date: z.string().min(1),
  origin: z.string().max(300),
  destination: z.string().max(300),
  distance: z.number().nonnegative(),
  rate: z.number().nonnegative(),
  amount: z.number().nonnegative(),
  createdAt: z.number().int().nonnegative(),
})

const backupDataSchema = z.object({
  rehearsals: z.array(rehearsalRecordSchema).optional().default([]),
  gigs: z.array(gigRecordSchema).optional().default([]),
  rehearsalTemplates: z.array(rehearsalTemplateSchema).optional().default([]),
  mileageLogs: z.array(mileageLogSchema).optional().default([]),
})

export const databaseBackupSchema = z.object({
  version: z.number().int().min(1),
  timestamp: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .transform((value) => (typeof value === 'number' ? value : Date.now())),
  data: backupDataSchema,
})

export type DatabaseBackup = z.infer<typeof databaseBackupSchema>

export type DatabaseImportSummary = {
  rehearsals: number
  gigs: number
  rehearsalTemplates: number
  mileageLogs: number
}

export type InvalidRecordCounts = Partial<Record<BackupTableKey, number>>

export class DatabaseImportValidationError extends Error {
  constructor(
    message: string,
    public readonly invalidCounts: InvalidRecordCounts,
    public readonly issues: ZodIssue[]
  ) {
    super(message)
    this.name = 'DatabaseImportValidationError'
  }
}

const findTableFromIssuePath = (
  path: Array<string | number>
): { table?: BackupTableKey; index?: number } => {
  for (let i = 0; i < path.length; i++) {
    const segment = path[i]
    if (segment === 'data') {
      continue
    }
    if (typeof segment === 'string' && BACKUP_TABLE_KEYS.includes(segment as BackupTableKey)) {
      const indexCandidate = path[i + 1]
      return {
        table: segment as BackupTableKey,
        index: typeof indexCandidate === 'number' ? indexCandidate : undefined,
      }
    }
  }
  return {}
}

export const summarizeInvalidRecords = (issues: ZodIssue[]): InvalidRecordCounts => {
  const sets: Record<BackupTableKey, Set<number>> = {
    rehearsals: new Set(),
    gigs: new Set(),
    rehearsalTemplates: new Set(),
    mileageLogs: new Set(),
  }

  for (const issue of issues) {
    const { table, index } = findTableFromIssuePath(issue.path)
    if (table && typeof index === 'number') {
      sets[table].add(index)
    }
  }

  return BACKUP_TABLE_KEYS.reduce<InvalidRecordCounts>((acc, key) => {
    if (sets[key].size > 0) {
      acc[key] = sets[key].size
    }
    return acc
  }, {})
}

export const formatInvalidRecordSummary = (invalidCounts: InvalidRecordCounts): string | null => {
  const parts = BACKUP_TABLE_KEYS.flatMap((key) => {
    const count = invalidCounts[key]
    if (!count || count <= 0) {
      return []
    }
    const labels = BACKUP_TABLE_LABELS[key]
    const noun = count === 1 ? labels.singular : labels.plural
    return [`${count} invalid ${noun}`]
  })

  return parts.length ? parts.join(', ') : null
}

export const parseDatabaseBackupOrThrow = (backup: unknown): DatabaseBackup => {
  const parsed = databaseBackupSchema.safeParse(backup)
  if (!parsed.success) {
    const invalidCounts = summarizeInvalidRecords(parsed.error.issues)
    const summary = formatInvalidRecordSummary(invalidCounts)
    const message = summary ?? 'Invalid backup format'

    console.error('Invalid backup provided:', parsed.error.flatten())
    if (summary) {
      console.error('Invalid record counts:', invalidCounts)
    }

    throw new DatabaseImportValidationError(message, invalidCounts, parsed.error.issues)
  }

  return parsed.data
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
    const errorMessage = error instanceof Error ? error.message : 'Failed to export database'
    console.error('Error exporting database:', error)
    showToast.error(errorMessage)
    throw error
  }
}

/**
 * Import database from JSON
 * WARNING: This will clear existing data before importing
 */
export const importDatabase = async (backup: unknown): Promise<DatabaseImportSummary> => {
  const validatedBackup = parseDatabaseBackupOrThrow(backup)
  const { rehearsals, gigs, rehearsalTemplates, mileageLogs } = validatedBackup.data
  const summary: DatabaseImportSummary = {
    rehearsals: rehearsals.length,
    gigs: gigs.length,
    rehearsalTemplates: rehearsalTemplates.length,
    mileageLogs: mileageLogs.length,
  }

  try {
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

    // eslint-disable-next-line no-console
    console.log('Database imported successfully:', summary)
    return summary
  } catch (error) {
    console.error('Error importing database:', error)
    throw error instanceof Error ? error : new Error('Failed to import database')
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

    showToast.success('Backup created successfully')
    return backupKey
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create backup'
    console.error('Error creating backup:', error)
    showToast.error(errorMessage)
    throw error
  }
}

/**
 * Restore from the latest backup in localStorage
 */
export const restoreBackup = async (): Promise<void> => {
  try {
    const latestBackupKey = localStorage.getItem('soundcheck-latest-backup')
    if (!latestBackupKey) {
      const errorMessage = 'No backup found'
      showToast.warning(errorMessage)
      throw new Error(errorMessage)
    }

    const backupData = localStorage.getItem(latestBackupKey)
    if (!backupData) {
      const errorMessage = 'Backup data not found'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    const backupRaw = JSON.parse(backupData)
    await importDatabase(backupRaw)
    showToast.success('Backup restored successfully')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to restore backup'
    console.error('Error restoring backup:', error)
    showToast.error(errorMessage)
    throw error
  }
}

/**
 * Get the timestamp of the latest backup
 */
export const getBackupTimestamp = (): number | null => {
  try {
    const latestBackupKey = localStorage.getItem('soundcheck-latest-backup')
    if (!latestBackupKey) {
      return null
    }

    const backupData = localStorage.getItem(latestBackupKey)
    if (!backupData) {
      return null
    }

    const parsed = databaseBackupSchema.safeParse(JSON.parse(backupData))
    if (!parsed.success) {
      return null
    }
    return parsed.data.timestamp
  } catch (error) {
    console.error('Error getting backup timestamp:', error)
    return null
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
          const parsed = databaseBackupSchema.safeParse(JSON.parse(data))
          if (parsed.success) {
            backups.push({ key, timestamp: parsed.data.timestamp })
          }
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
export const downloadDatabase = async (
  filename: string = 'soundcheck-backup.json'
): Promise<void> => {
  try {
    const backup = await exportDatabase()
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = toSafeFilename(filename.replace(/\.json$/i, ''), '.json')
    a.click()

    URL.revokeObjectURL(url)
    showToast.success('Database download started')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to download database'
    console.error('Error downloading database:', error)
    showToast.error(errorMessage)
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
        const backupRaw = JSON.parse(content)
        await importDatabase(backupRaw)
        showToast.success('Database imported successfully')
        resolve()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload and import database'
        showToast.error(errorMessage)
        reject(error)
      }
    }

    reader.onerror = () => {
      const errorMessage = 'Failed to read file'
      showToast.error(errorMessage)
      reject(new Error(errorMessage))
    }
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
