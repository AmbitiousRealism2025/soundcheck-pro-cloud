import { useState } from 'react'
import { seedDatabase, clearDatabase, exportDatabase, importDatabase } from '@/db/seed'

/**
 * Developer Tools Component
 * Only rendered in development mode
 * Provides utilities for seeding, clearing, exporting, and importing database data
 */
export function DevTools() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  // Only render in development mode
  if (!import.meta.env.DEV) {
    return null
  }

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSeed = async () => {
    try {
      await seedDatabase()
      showMessage('✅ Database seeded successfully!', 'success')
      // Reload to reflect changes
      setTimeout(() => window.location.reload(), 500)
    } catch (error) {
      showMessage(`❌ Error seeding database: ${error}`, 'error')
    }
  }

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear all data?')) {
      return
    }
    try {
      await clearDatabase()
      showMessage('✅ Database cleared successfully!', 'success')
      // Reload to reflect changes
      setTimeout(() => window.location.reload(), 500)
    } catch (error) {
      showMessage(`❌ Error clearing database: ${error}`, 'error')
    }
  }

  const handleExport = async () => {
    try {
      const json = await exportDatabase()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `soundcheck-backup-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showMessage('✅ Database exported successfully!', 'success')
    } catch (error) {
      showMessage(`❌ Error exporting database: ${error}`, 'error')
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        await importDatabase(text)
        showMessage('✅ Database imported successfully!', 'success')
        // Reload to reflect changes
        setTimeout(() => window.location.reload(), 500)
      } catch (error) {
        showMessage(`❌ Error importing database: ${error}`, 'error')
      }
    }
    input.click()
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        title="Developer Tools"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* DevTools panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              DevTools
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Message notification */}
          {message && (
            <div
              className={`px-4 py-2 text-xs ${
                messageType === 'success'
                  ? 'bg-green-900 text-green-100'
                  : 'bg-red-900 text-red-100'
              }`}
            >
              {message}
            </div>
          )}

          {/* Actions */}
          <div className="p-4 space-y-2">
            <p className="text-xs text-gray-400 mb-3">Database Operations</p>

            <button
              onClick={handleSeed}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Seed Database
            </button>

            <button
              onClick={handleClear}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Clear Database
            </button>

            <div className="border-t border-gray-700 my-3 pt-3">
              <p className="text-xs text-gray-400 mb-3">Import/Export</p>

              <button
                onClick={handleExport}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                Export Data
              </button>

              <button
                onClick={handleImport}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Import Data
              </button>
            </div>

            <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-700">
              Development Mode Only
            </div>
          </div>
        </div>
      )}
    </>
  )
}
