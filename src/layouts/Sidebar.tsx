import { NavLink } from 'react-router-dom'
import { Home, Music, Calendar, BarChart3, Settings } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useEffect, useRef } from 'react'

// Extend Window interface for custom sidebar refs
declare global {
  interface Window {
    __soundcheckSidebarRefs?: {
      toggleButtonRef: React.RefObject<HTMLButtonElement>
    }
  }
}

export function Sidebar() {
  const sidebarOpen = useStore(state => state.sidebarOpen)
  const setSidebarOpen = useStore(state => state.setSidebarOpen)

  const firstNavLinkRef = useRef<HTMLAnchorElement | null>(null)
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  // Initialize window global for toggle button ref (assigned by Header)
  useEffect(() => {
    if (!window.__soundcheckSidebarRefs) {
      window.__soundcheckSidebarRefs = {
        toggleButtonRef: { current: null },
      }
    }
    return () => {
      if (window.__soundcheckSidebarRefs) {
        delete window.__soundcheckSidebarRefs
      }
    }
  }, [])

  // When sidebar opens on mobile, move focus to first nav link and trap focus
  useEffect(() => {
    if (!sidebarOpen) {
      // Return focus to toggle button when closing if available
      const toggleButton = window.__soundcheckSidebarRefs?.toggleButtonRef?.current
      if (toggleButton) {
        toggleButton.focus()
      }
      return
    }

    const isMobile = window.innerWidth < 768
    if (!isMobile) return

    // Focus first nav link
    if (firstNavLinkRef.current) {
      firstNavLinkRef.current.focus()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!sidebarRef.current) return
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ]
      const focusable = Array.from(
        sidebarRef.current.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
      ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'))

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            event.preventDefault()
            first.focus()
          }
        }
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        setSidebarOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [sidebarOpen, setSidebarOpen])

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/rehearsals', icon: Music, label: 'Rehearsals' },
    { to: '/gigs', icon: Calendar, label: 'Gigs' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside
      ref={sidebarRef}
      className={`
        fixed left-0 top-0 h-full
        bg-background/95 backdrop-blur-md
        border-r border-white/10
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-64' : 'w-0 md:w-16'}
        overflow-hidden
        z-40
      `}
      aria-hidden={!sidebarOpen && window.innerWidth < 768}
    >
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-white/10">
          <div className={`font-bold text-lg whitespace-nowrap transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
            {sidebarOpen ? (
              <span>SoundCheck Pro</span>
            ) : (
              <span className="hidden md:block text-center">SC</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ to, icon: Icon, label }, index) => (
            <NavLink
              key={to}
              to={to}
              ref={index === 0 ? firstNavLinkRef : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'hover:bg-white/5 text-foreground/70 hover:text-foreground'
                }`
              }
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className={`whitespace-nowrap transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-0'}`}>
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section (placeholder) */}
        <div className="p-4 border-t border-white/10">
          <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold">U</span>
            </div>
            <div className={`flex-1 min-w-0 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-0'}`}>
              <p className="text-sm font-medium truncate">User</p>
              <p className="text-xs text-foreground/50 truncate">Musician</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
