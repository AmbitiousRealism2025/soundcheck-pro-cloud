import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { RouteSuspenseFallback } from './components/SuspenseFallback'

// Lazy load route components for better code splitting
const Home = lazy(() => import('./app/routes/Home'))
const RehearsalsList = lazy(() => import('./app/routes/RehearsalsList'))
const RehearsalDetail = lazy(() => import('./app/routes/RehearsalDetail'))
const GigsList = lazy(() => import('./app/routes/GigsList'))
const GigDetail = lazy(() => import('./app/routes/GigDetail'))
const Analytics = lazy(() => import('./app/routes/Analytics'))
const Settings = lazy(() => import('./app/routes/Settings'))

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/rehearsals"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <RehearsalsList />
            </Suspense>
          }
        />
        <Route
          path="/rehearsals/:id"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <RehearsalDetail />
            </Suspense>
          }
        />
        <Route
          path="/gigs"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <GigsList />
            </Suspense>
          }
        />
        <Route
          path="/gigs/:id"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <GigDetail />
            </Suspense>
          }
        />
        <Route
          path="/analytics"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <Analytics />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <Settings />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}
