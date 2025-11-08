import { NavLink } from 'react-router-dom'
import { Home, Music, Calendar, Settings } from 'lucide-react'

/**
 * Bottom navigation bar for mobile devices
 * Hidden on desktop (≥768px)
 */
export function MobileNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/rehearsals', icon: Music, label: 'Rehearsals' },
    { to: '/gigs', icon: Calendar, label: 'Gigs' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-white/10 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[60px] ${
                isActive
                  ? 'text-primary'
                  : 'text-foreground/60 hover:text-foreground'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-xs">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
