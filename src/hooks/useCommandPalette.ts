import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import {
  Home,
  Music,
  Calendar,
  Settings,
  Plus,
  Download,
  Sun,
  Moon,
  MonitorSmartphone,
  BarChart3,
  FileText
} from 'lucide-react'

export interface Command {
  id: string
  label: string
  description?: string
  icon?: any
  action: () => void
  keywords?: string[]
  group?: 'navigation' | 'actions' | 'settings' | 'recent'
}

/**
 * Hook for command palette logic
 * Provides commands, search, and execution
 */
export function useCommandPalette() {
  const navigate = useNavigate()
  const closeCommandPalette = useStore(state => state.closeCommandPalette)
  const setTheme = useStore(state => state.setTheme)
  const rehearsals = useStore(state => state.rehearsals)
  const gigs = useStore(state => state.gigs)

  const [searchQuery, setSearchQuery] = useState('')

  // Define all available commands
  const allCommands = useMemo((): Command[] => {
    const commands: Command[] = [
      // Navigation commands
      {
        id: 'nav-home',
        label: 'Go to Dashboard',
        description: 'View your command center',
        icon: Home,
        action: () => {
          navigate('/')
          closeCommandPalette()
        },
        keywords: ['home', 'dashboard', 'main'],
        group: 'navigation',
      },
      {
        id: 'nav-rehearsals',
        label: 'Go to Rehearsals',
        description: 'Manage your rehearsals',
        icon: Music,
        action: () => {
          navigate('/rehearsals')
          closeCommandPalette()
        },
        keywords: ['rehearsals', 'practice', 'sessions'],
        group: 'navigation',
      },
      {
        id: 'nav-gigs',
        label: 'Go to Gigs',
        description: 'Manage your performances',
        icon: Calendar,
        action: () => {
          navigate('/gigs')
          closeCommandPalette()
        },
        keywords: ['gigs', 'shows', 'performances', 'concerts'],
        group: 'navigation',
      },
      {
        id: 'nav-analytics',
        label: 'Go to Analytics',
        description: 'View insights and stats',
        icon: BarChart3,
        action: () => {
          navigate('/analytics')
          closeCommandPalette()
        },
        keywords: ['analytics', 'insights', 'stats', 'reports'],
        group: 'navigation',
      },
      {
        id: 'nav-settings',
        label: 'Go to Settings',
        description: 'Configure your preferences',
        icon: Settings,
        action: () => {
          navigate('/settings')
          closeCommandPalette()
        },
        keywords: ['settings', 'preferences', 'config'],
        group: 'navigation',
      },

      // Action commands
      {
        id: 'action-new-rehearsal',
        label: 'New Rehearsal',
        description: 'Create a new rehearsal',
        icon: Plus,
        action: () => {
          navigate('/rehearsals?new=1')
          closeCommandPalette()
        },
        keywords: ['new', 'create', 'rehearsal', 'practice'],
        group: 'actions',
      },
      {
        id: 'action-new-gig',
        label: 'New Gig',
        description: 'Create a new gig',
        icon: Plus,
        action: () => {
          navigate('/gigs?new=1')
          closeCommandPalette()
        },
        keywords: ['new', 'create', 'gig', 'show', 'performance'],
        group: 'actions',
      },
      {
        id: 'action-export',
        label: 'Export Data',
        description: 'Download all your data',
        icon: Download,
        action: () => {
          navigate('/settings')
          closeCommandPalette()
          // Scroll to data management section
          setTimeout(() => {
            const section = document.getElementById('data-management')
            section?.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        },
        keywords: ['export', 'download', 'backup', 'data'],
        group: 'actions',
      },

      // Theme commands
      {
        id: 'theme-auto',
        label: 'Set Theme: Auto',
        description: 'Use system theme',
        icon: MonitorSmartphone,
        action: () => {
          setTheme('auto')
          closeCommandPalette()
        },
        keywords: ['theme', 'auto', 'system'],
        group: 'settings',
      },
      {
        id: 'theme-light',
        label: 'Set Theme: Light',
        description: 'Switch to light theme',
        icon: Sun,
        action: () => {
          setTheme('light')
          closeCommandPalette()
        },
        keywords: ['theme', 'light', 'bright'],
        group: 'settings',
      },
      {
        id: 'theme-dark',
        label: 'Set Theme: Dark',
        description: 'Switch to dark theme',
        icon: Moon,
        action: () => {
          setTheme('dark')
          closeCommandPalette()
        },
        keywords: ['theme', 'dark', 'night'],
        group: 'settings',
      },
    ]

    // Add recent rehearsals (up to 5)
    const recentRehearsals = rehearsals
      .slice()
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)

    recentRehearsals.forEach(rehearsal => {
      commands.push({
        id: `rehearsal-${rehearsal.id}`,
        label: rehearsal.eventName,
        description: `Rehearsal on ${new Date(rehearsal.date).toLocaleDateString()}`,
        icon: Music,
        action: () => {
          navigate(`/rehearsals/${rehearsal.id}`)
          closeCommandPalette()
        },
        keywords: ['rehearsal', rehearsal.eventName.toLowerCase()],
        group: 'recent',
      })
    })

    // Add recent gigs (up to 5)
    const recentGigs = gigs
      .slice()
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)

    recentGigs.forEach(gig => {
      commands.push({
        id: `gig-${gig.id}`,
        label: gig.eventName || gig.venue.name,
        description: `Gig on ${new Date(gig.date).toLocaleDateString()}`,
        icon: Calendar,
        action: () => {
          navigate(`/gigs/${gig.id}`)
          closeCommandPalette()
        },
        keywords: ['gig', (gig.eventName || gig.venue.name).toLowerCase()],
        group: 'recent',
      })
    })

    return commands
  }, [navigate, closeCommandPalette, setTheme, rehearsals, gigs])

  // Filter commands based on search query
  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) {
      return allCommands
    }

    const query = searchQuery.toLowerCase().trim()
    return allCommands.filter(command => {
      // Search in label
      if (command.label.toLowerCase().includes(query)) {
        return true
      }

      // Search in description
      if (command.description?.toLowerCase().includes(query)) {
        return true
      }

      // Search in keywords
      if (command.keywords?.some(keyword => keyword.includes(query))) {
        return true
      }

      return false
    })
  }, [allCommands, searchQuery])

  // Group filtered commands
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {
      navigation: [],
      actions: [],
      settings: [],
      recent: [],
    }

    filteredCommands.forEach(command => {
      const group = command.group || 'actions'
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(command)
    })

    return groups
  }, [filteredCommands])

  return {
    searchQuery,
    setSearchQuery,
    filteredCommands,
    groupedCommands,
    executeCommand: (command: Command) => {
      command.action()
    },
  }
}
