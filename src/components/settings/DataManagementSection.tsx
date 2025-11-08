import { useState } from 'react'
import { Database, Download, Upload, Trash2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { exportAllData, importDatabase, createBackup, restoreBackup, getBackupTimestamp } from '@/db/backup'
import { useStore } from '@/store/useStore'
import { useToast } from '@/components/ui/ToastProvider'
import { format } from 'date-fns'

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
            const json = JSON.parse(event.target?.result as string)
            await importDatabase(json)
            await loadRehearsals()
            await loadGigs()
            toast.success('Data imported successfully')
          } catch (error) {
            console.error('Import error:', error)
            toast.error('Failed to import data')
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
              Upload a JSON file to import data
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
    </div>
  )
}
