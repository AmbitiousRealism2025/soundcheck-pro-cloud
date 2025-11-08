import { Menu, Plus, Bell } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export function Header() {
  const toggleSidebar = useStore(state => state.toggleSidebar)
  const sidebarOpen = useStore(state => state.sidebarOpen)
  const navigate = useNavigate()
  const [quickAddOpen, setQuickAddOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Menu toggle and breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumbs placeholder - will be enhanced later */}
          <div className="hidden md:block text-sm text-foreground/70">
            {/* Could add dynamic breadcrumbs based on current route */}
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2">
          {/* Quick Add Button */}
          <div className="relative">
            <button
              onClick={() => setQuickAddOpen(!quickAddOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg transition-colors"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add</span>
            </button>

            {/* Quick Add Dropdown */}
            {quickAddOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setQuickAddOpen(false)}
                />
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-background/95 backdrop-blur-md border border-white/10 rounded-lg shadow-lg overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setQuickAddOpen(false)
                      navigate('/rehearsals?new=1')
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors"
                  >
                    <div className="font-medium">New Rehearsal</div>
                    <div className="text-xs text-foreground/50">Plan your next session</div>
                  </button>
                  <button
                    onClick={() => {
                      setQuickAddOpen(false)
                      navigate('/gigs?new=1')
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-t border-white/5"
                  >
                    <div className="font-medium">New Gig</div>
                    <div className="text-xs text-foreground/50">Schedule a performance</div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Notifications placeholder */}
          <button
            className="p-2 hover:bg-white/5 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {/* Notification badge - will be implemented in Phase 4 */}
          </button>

          {/* Theme toggle placeholder - will be implemented in Phase 4 */}
        </div>
      </div>
    </header>
  )
}
