import { useState } from 'react'
import { Database, Download, Upload, Trash2, RefreshCw, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  exportAllData,
  importDatabase,
  createBackup,
  restoreBackup,
  getBackupTimestamp,
  DatabaseImportValidationError,
  formatInvalidRecordSummary,
  type DatabaseImportSummary,
} from '@/db/backup'
import { useStore } from '@/store/useStore'
import { useToast } from '@/components/ui/ToastProvider'
import { format } from 'date-fns'

const formatImportSuccess = (summary: DatabaseImportSummary) => {
  const describe = (count: number, singular: string, plural: string) =>
    `${count} ${count === 1 ? singular : plural}`

  const parts = [
    describe(summary.rehearsals, 'rehearsal', 'rehearsals'),
    describe(summary.gigs, 'gig', 'gigs'),
    summary.rehearsalTemplates
      ? describe(summary.rehearsalTemplates, 'rehearsal template', 'rehearsal templates')
      : null,
    summary.mileageLogs ? describe(summary.mileageLogs, 'mileage log', 'mileage logs') : null,
  ].filter(Boolean)

  return parts.join(', ')
}

/**
 * Data management settings section
 * Export, import, backup, restore, and reset app data
 */
export function DataManagementSection() {
  const loadRehearsals = useStore(state => state.loadRehearsals)
  const loadGigs = useStore(state => state.loadGigs)
  const toast = useToast()

  const [resetModalOpen, setResetModalOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [lastBackup, setLastBackup] = useState<number | null>(getBackupTimestamp())

  // Import confirmation modal state
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [importSummary, setImportSummary] = useState<{
    version?: number
    gigs?: number
    rehearsals?: number
    mileageLogs?: number
    rehearsalTemplates?: number
    raw?: unknown
  } | null>(null)
  const [importConfirmText, setImportConfirmText] = useState('')
  const [importCreateBackup, setImportCreateBackup] = useState(true)
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = async () => {
    try {
      await exportAllData()
      toast.success('Data exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
    }
  }

  const handleImport = async () => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'application/json'

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = async (event) => {
          try {
            const json: unknown = JSON.parse(event.target?.result as string)

            // Type guard for backup data structure
            type RawBackup = {
              version?: number
              data?: {
                gigs?: unknown[]
                rehearsals?: unknown[]
                rehearsalTemplates?: unknown[]
                mileageLogs?: unknown[]
              }
            }

            const isBackup = (val: unknown): val is RawBackup => {
              return val !== null && typeof val === 'object'
            }

            // Derive a lightweight summary for confirmation UI
            const backup = isBackup(json) ? json : {}
            const data = backup.data || {}
            const gigs = Array.isArray(data.gigs) ? data.gigs.length : undefined
            const rehearsals = Array.isArray(data.rehearsals)
              ? data.rehearsals.length
              : undefined
            const rehearsalTemplates = Array.isArray(data.rehearsalTemplates)
              ? data.rehearsalTemplates.length
              : undefined
            const mileageLogs = Array.isArray(data.mileageLogs)
              ? data.mileageLogs.length
              : undefined
            const version = backup.version

            setImportSummary({
              version,
              gigs,
              rehearsals,
              mileageLogs,
              rehearsalTemplates,
              raw: json,
            })
            setImportConfirmText('')
            setImportCreateBackup(true)
            setImportModalOpen(true)
          } catch (error) {
            console.error('Import error:', error)
            toast.error('Failed to parse import file')
          }
        }
        reader.readAsText(file)
      }

      input.click()
    } catch (error) {
      console.error('Import error:', error)
      toast.error('Failed to import data')
    }
  }

  const handleConfirmImport = async () => {
    if (!importSummary?.raw) return
    if (importConfirmText !== 'IMPORT') {
      return
    }

    setIsImporting(true)
    try {
      if (importCreateBackup) {
        try {
          await createBackup()
          setLastBackup(Date.now())
        } catch (backupError) {
          console.error('Auto-backup before import failed:', backupError)
          // Proceeding is intentional; user explicitly chose to import
          toast.error('Failed to create automatic backup before import')
        }
      }

      const summary = await importDatabase(importSummary.raw)
      await loadRehearsals()
      await loadGigs()
      toast.success(`Data imported (${formatImportSuccess(summary)})`)
      setImportModalOpen(false)
      setImportSummary(null)
      setImportConfirmText('')
    } catch (error) {
      console.error('Import error:', error)
      if (error instanceof DatabaseImportValidationError) {
        const detail = formatInvalidRecordSummary(error.invalidCounts)
        const message = detail ? `Import validation failed: ${detail}` : error.message
        toast.error(message ?? 'Import validation failed')
      } else {
        const fallback = error instanceof Error ? error.message : 'Failed to import data'
        toast.error(fallback)
      }
    } finally {
      setIsImporting(false)
    }
  }

  const handleCreateBackup = async () => {
    try {
      await createBackup()
      setLastBackup(Date.now())
      toast.success('Backup created successfully')
    } catch (error) {
      console.error('Backup error:', error)
      toast.error('Failed to create backup')
    }
  }

  const handleRestoreBackup = async () => {
    try {
      await restoreBackup()
      await loadRehearsals()
      await loadGigs()
      setLastBackup(getBackupTimestamp())
      toast.success('Backup restored successfully')
    } catch (error) {
      console.error('Restore error:', error)
      toast.error('Failed to restore backup')
    }
  }

  const handleReset = async () => {
    setIsResetting(true)
    try {
      // Clear IndexedDB
      const { db } = await import('@/db/db')
      await db.delete()

      // Clear localStorage
      localStorage.clear()

      // Reload the page
      window.location.reload()
    } catch (error) {
      console.error('Reset error:', error)
      toast.error('Failed to reset app')
      setIsResetting(false)
    }
  }

  return (
    <div className="space-y-4" id="data-management">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Database size={20} />
          Data Management
        </h3>
        <p className="text-sm text-foreground/70 mb-4">
          Export, import, backup, and manage your data
        </p>
      </div>

      {/* Last Backup */}
      {lastBackup && (
        <div className="p-3 rounded-lg bg-info/20 text-info border border-info/30 text-sm">
          Last backup: {format(lastBackup, 'MMM d, yyyy h:mm a')}
        </div>
      )}

      {/* Export Data */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-medium mb-1">Export Data</h4>
            <p className="text-sm text-foreground/70">
              Download all your data as a JSON file
            </p>
          </div>
          <Button variant="secondary" onClick={handleExport}>
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Import Data */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-medium mb-1">Import Data</h4>
            <p className="text-sm text-foreground/70">
              Upload a JSON file to import data. Existing data may be overwritten.
            </p>
          </div>
          <Button variant="secondary" onClick={handleImport}>
            <Upload size={16} />
            Import
          </Button>
        </div>
      </div>

      {/* Create Backup */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-medium mb-1">Create Backup</h4>
            <p className="text-sm text-foreground/70">
              Save a backup to local storage
            </p>
          </div>
          <Button variant="secondary" onClick={handleCreateBackup}>
            <RefreshCw size={16} />
            Backup
          </Button>
        </div>
      </div>

      {/* Restore Backup */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-medium mb-1">Restore Backup</h4>
            <p className="text-sm text-foreground/70">
              Restore data from the last backup
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleRestoreBackup}
            disabled={!lastBackup}
          >
            <RefreshCw size={16} />
            Restore
          </Button>
        </div>
      </div>

      {/* Reset App */}
      <div className="p-4 rounded-lg bg-error/20 border border-error/30">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-medium mb-1 text-error">Reset App</h4>
            <p className="text-sm text-error/70">
              Clear all data and settings. This cannot be undone.
            </p>
          </div>
          <Button variant="danger" onClick={() => setResetModalOpen(true)}>
            <Trash2 size={16} />
            Reset
          </Button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        open={resetModalOpen}
        onClose={() => !isResetting && setResetModalOpen(false)}
        title="Reset App?"
      >
        <div className="space-y-4">
          <p className="text-foreground/70">
            This will delete all your rehearsals, gigs, and settings. This action cannot be undone.
          </p>
          <p className="text-sm text-warning">
            Consider creating a backup first.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setResetModalOpen(false)}
              disabled={isResetting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReset}
              disabled={isResetting}
            >
              {isResetting ? 'Resetting...' : 'Yes, Reset App'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Import Confirmation Modal */}
      <Modal
        open={importModalOpen}
        onClose={() => !isImporting && setImportModalOpen(false)}
        title="Confirm Data Import"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="text-warning mt-1" size={18} />
            <div className="space-y-1 text-sm">
              <p className="text-foreground/80">
                You are about to import data from a backup file. This may overwrite your current
                rehearsals, gigs, mileage logs, and settings.
              </p>
              <p className="text-warning">
                This action is destructive. Please review the summary below and confirm.
              </p>
            </div>
          </div>

          {importSummary && (
            <div className="text-xs bg-white/5 border border-white/10 rounded-md p-3 space-y-1">
              {importSummary.version && (
                <p>
                  <span className="font-medium">Version:</span>{' '}
                  {importSummary.version}
                </p>
              )}
              {typeof importSummary.rehearsals === 'number' && (
                <p>
                  <span className="font-medium">Rehearsals:</span>{' '}
                  {importSummary.rehearsals}
                </p>
              )}
              {typeof importSummary.gigs === 'number' && (
                <p>
                  <span className="font-medium">Gigs:</span>{' '}
                  {importSummary.gigs}
                </p>
              )}
              {typeof importSummary.mileageLogs === 'number' && (
                <p>
                  <span className="font-medium">Mileage logs:</span>{' '}
                  {importSummary.mileageLogs}
                </p>
              )}
            </div>
          )}

          <label className="flex items-center gap-2 text-xs text-foreground/80">
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={importCreateBackup}
              onChange={(e) => setImportCreateBackup(e.target.checked)}
              disabled={isImporting}
            />
            <span>
              Create an automatic backup of current data before importing
              (recommended)
            </span>
          </label>

          <div className="space-y-1 text-xs">
            <p className="text-foreground/70">
              To confirm, type <span className="font-mono font-semibold">IMPORT</span> below.
            </p>
            <input
              type="text"
              value={importConfirmText}
              onChange={(e) => setImportConfirmText(e.target.value)}
              className="w-full rounded-md bg-black/40 border border-white/15 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Type IMPORT to confirm"
              disabled={isImporting}
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button
              variant="ghost"
              onClick={() => {
                if (!isImporting) {
                  setImportModalOpen(false)
                  setImportSummary(null)
                  setImportConfirmText('')
                }
              }}
              disabled={isImporting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmImport}
              disabled={
                isImporting || importConfirmText !== 'IMPORT' || !importSummary?.raw
              }
            >
              {isImporting ? 'Importing...' : 'Confirm Import'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
