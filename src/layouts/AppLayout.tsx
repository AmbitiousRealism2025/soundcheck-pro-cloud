import { Outlet } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { useEffect } from 'react'

/**
 * Main application layout component
 * Provides consistent structure: sidebar, header, content area, mobile nav
 * Responsive: sidebar collapses to drawer on mobile (<768px)
 */
export function AppLayout() {
  const sidebarOpen = useStore(state => state.sidebarOpen)
  const setSidebarOpen = useStore(state => state.setSidebarOpen)

  // Close sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setSidebarOpen])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Skip to content
      </a>

      <Sidebar />

      {/* Main content area with dynamic margin based on sidebar state */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-16'
        }`}
      >
        <Header />

        {/* Main content */}
        <main id="main-content" className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>

        <MobileNav />
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}
    </div>
  )
}
