import { NavLink } from 'react-router-dom'
import { Home, Music, Calendar, Settings } from 'lucide-react'
import { useStore } from '@/store/useStore'

export function Sidebar() {
  const sidebarOpen = useStore(state => state.sidebarOpen)

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/rehearsals', icon: Music, label: 'Rehearsals' },
    { to: '/gigs', icon: Calendar, label: 'Gigs' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full
        bg-background/95 backdrop-blur-md
        border-r border-white/10
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-64' : 'w-0 md:w-16'}
        overflow-hidden
        z-40
      `}
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
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
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
