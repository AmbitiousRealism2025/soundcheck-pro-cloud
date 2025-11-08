import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './AppRouter'
import { DevTools } from './dev/DevTools'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SuspenseFallback } from './components/SuspenseFallback'
import { OfflineBanner } from './components/OfflineBanner'
import { UpdateNotification } from './components/UpdateNotification'
import { ToastProvider } from './components/ui/ToastProvider'
import { CommandPalette } from './components/CommandPalette'
import { KeyboardShortcutsProvider } from './components/KeyboardShortcutsProvider'
import './styles/globals.css'
import './styles/theme.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <Suspense fallback={<SuspenseFallback />}>
            <KeyboardShortcutsProvider />
            <CommandPalette />
            <OfflineBanner />
            <UpdateNotification />
            <AppRouter />
            <DevTools />
          </Suspense>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
