import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import Home from './app/routes/Home'
import RehearsalsList from './app/routes/RehearsalsList'
import RehearsalDetail from './app/routes/RehearsalDetail'
import GigsList from './app/routes/GigsList'
import GigDetail from './app/routes/GigDetail'
import Settings from './app/routes/Settings'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/rehearsals" element={<RehearsalsList />} />
        <Route path="/rehearsals/:id" element={<RehearsalDetail />} />
        <Route path="/gigs" element={<GigsList />} />
        <Route path="/gigs/:id" element={<GigDetail />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
