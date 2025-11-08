import { useState } from 'react'
import { Info, Github, Bug, Lightbulb, RefreshCw, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/ToastProvider'
import { useRegisterSW } from 'virtual:pwa-register/react'

/**
 * About section
 * App version, credits, links, and replay onboarding
 */
export function AboutSection() {
  const toast = useToast()
  const [checkingUpdate, setCheckingUpdate] = useState(false)

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      console.log('SW Registered:', registration)
    },
    onRegisterError(error) {
      console.error('SW registration error:', error)
    },
  })

  const handleReplayOnboarding = () => {
    localStorage.removeItem('hasSeenTour')
    toast.success('Onboarding will replay on next page load')
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  const handleCheckForUpdates = async () => {
    setCheckingUpdate(true)
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.update()
        if (needRefresh) {
          toast.info('Update available! Click "Update Now" in the notification.')
        } else {
          toast.success('You are running the latest version')
        }
      } else {
        toast.info('Service Worker not registered')
      }
    } catch (error) {
      console.error('Failed to check for updates:', error)
      toast.error('Failed to check for updates')
    } finally {
      setCheckingUpdate(false)
    }
  }

  const appVersion = '1.0.0' // Could be imported from package.json
  const buildDate = new Date().toLocaleDateString()

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Info size={20} />
          About
        </h3>
        <p className="text-sm text-foreground/70 mb-4">
          SoundCheck Pro - Your offline-first rehearsal and gig manager
        </p>
      </div>

      {/* App Info */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-foreground/70">Version</span>
          <span className="font-mono">{appVersion}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/70">Build Date</span>
          <span>{buildDate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/70">Storage</span>
          <span>IndexedDB (Offline-first)</span>
        </div>
      </div>

      {/* Credits */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <h4 className="font-medium mb-2">Built with</h4>
        <p className="text-sm text-foreground/70">
          React, TypeScript, Zustand, Dexie, Tailwind CSS, and Vite
        </p>
      </div>

      {/* Links */}
      <div className="space-y-2">
        <a
          href="https://github.com/yourusername/soundcheck-pro"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <Github size={18} />
          <span className="flex-1">View on GitHub</span>
          <span className="text-xs text-foreground/50">↗</span>
        </a>

        <a
          href="https://github.com/yourusername/soundcheck-pro/issues/new?template=bug.md"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <Bug size={18} />
          <span className="flex-1">Report a Bug</span>
          <span className="text-xs text-foreground/50">↗</span>
        </a>

        <a
          href="https://github.com/yourusername/soundcheck-pro/issues/new?template=feature.md"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <Lightbulb size={18} />
          <span className="flex-1">Request a Feature</span>
          <span className="text-xs text-foreground/50">↗</span>
        </a>
      </div>

      {/* Check for Updates */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-medium mb-1">Check for Updates</h4>
            <p className="text-sm text-foreground/70">
              Manually check for app updates
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleCheckForUpdates}
            disabled={checkingUpdate}
          >
            <Download size={16} />
            {checkingUpdate ? 'Checking...' : 'Check'}
          </Button>
        </div>
      </div>

      {/* Replay Onboarding */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-medium mb-1">Replay Onboarding Tour</h4>
            <p className="text-sm text-foreground/70">
              See the welcome tour again
            </p>
          </div>
          <Button variant="secondary" onClick={handleReplayOnboarding}>
            <RefreshCw size={16} />
            Replay
          </Button>
        </div>
      </div>
    </div>
  )
}
