import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useUI } from '@/store/hooks'
import { exportAllData } from '@/db/backup'

/**
 * Quick action buttons for common tasks
 */
export function QuickActions() {
  const navigate = useNavigate()
  const { openModal } = useUI()

  const handleNewRehearsal = () => {
    openModal('create-rehearsal')
    navigate('/rehearsals')
  }

  const handleNewGig = () => {
    openModal('create-gig')
    navigate('/gigs')
  }

  const handleExportData = async () => {
    try {
      await exportAllData()
      // Toast notification would go here
      console.log('Data exported successfully')
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Button
        variant="primary"
        onClick={handleNewRehearsal}
        className="w-full"
      >
        <span className="text-lg mr-2">🎵</span>
        New Rehearsal
      </Button>

      <Button
        variant="primary"
        onClick={handleNewGig}
        className="w-full"
      >
        <span className="text-lg mr-2">🎤</span>
        New Gig
      </Button>

      <Button
        variant="secondary"
        onClick={() => navigate('/rehearsals')}
        className="w-full"
      >
        <span className="text-lg mr-2">📅</span>
        Calendar
      </Button>

      <Button
        variant="ghost"
        onClick={handleExportData}
        className="w-full"
      >
        <span className="text-lg mr-2">💾</span>
        Export
      </Button>
    </div>
  )
}
