import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './AppRouter'
import { DevTools } from './dev/DevTools'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SuspenseFallback } from './components/SuspenseFallback'
import { OfflineBanner } from './components/OfflineBanner'
import { UpdateNotification } from './components/UpdateNotification'
import { CommandPalette } from './components/CommandPalette'
import { KeyboardShortcutsProvider } from './components/KeyboardShortcutsProvider'
import { ToastProvider } from './components/ui/ToastProvider'
import { UIProvider } from './providers/UIProvider'
import { ThemeProvider } from './components/ThemeProvider'
import './styles/globals.css'
import './styles/theme.css'

import { useStore } from './store/useStore'

function resetStoreState() {
  try {
    // Use explicit slice reset actions instead of direct mutation
    const api = useStore.getState()

    if ('resetAll' in api && typeof api.resetAll === 'function') {
      api.resetAll()
    } else {
      // Fallback: call individual reset functions
      if ('resetRehearsals' in api && typeof api.resetRehearsals === 'function') {
        api.resetRehearsals()
      }
      if ('resetGigs' in api && typeof api.resetGigs === 'function') {
        api.resetGigs()
      }
      if ('resetMileageLogs' in api && typeof api.resetMileageLogs === 'function') {
        api.resetMileageLogs()
      }
    }

    const stateAfter = useStore.getState()
    if (!stateAfter || typeof stateAfter !== 'object') {
      window.location.reload()
    }
  } catch (error) {
    console.error('Failed to reset store state after error boundary reset:', error)
    window.location.reload()
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary onReset={resetStoreState}>
      <BrowserRouter>
        <ToastProvider>
          <UIProvider>
            <ThemeProvider>
              <Suspense fallback={<SuspenseFallback />}>
                <KeyboardShortcutsProvider />
                <CommandPalette />
                <OfflineBanner />
                <UpdateNotification />
                <AppRouter />
                <DevTools />
              </Suspense>
            </ThemeProvider>
          </UIProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
