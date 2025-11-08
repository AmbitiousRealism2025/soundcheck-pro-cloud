import { Route, Routes, NavLink, useNavigate } from 'react-router-dom'
import Home from './app/routes/Home'
import RehearsalsList from './app/routes/RehearsalsList'
import RehearsalDetail from './app/routes/RehearsalDetail'
import GigsList from './app/routes/GigsList'
import GigDetail from './app/routes/GigDetail'
import Settings from './app/routes/Settings'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function AppRouter() {
  const [addOpen, setAddOpen] = useState(false)
  const nav = useNavigate()
  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr]">
      <header className="px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">SoundCheck Pro</span>
          <nav className="hidden md:flex gap-3 text-sm">
            <NavLink className={({isActive}) => isActive ? 'underline' : ''} to="/">Home</NavLink>
            <NavLink className={({isActive}) => isActive ? 'underline' : ''} to="/rehearsals">Rehearsals</NavLink>
            <NavLink className={({isActive}) => isActive ? 'underline' : ''} to="/gigs">Gigs</NavLink>
            <NavLink className={({isActive}) => isActive ? 'underline' : ''} to="/settings">Settings</NavLink>
          </nav>
        </div>
        <button className="button" onClick={() => setAddOpen(v => !v)}><Plus className="inline mr-2" size={16}/>Add</button>
      </header>
      {addOpen && (
        <div className="px-4 py-2 bg-muted/60 border-b border-white/10 text-sm">
          <button className="mr-3 underline" onClick={() => { setAddOpen(false); nav('/rehearsals?new=1') }}>New Rehearsal</button>
          <button className="underline" onClick={() => { setAddOpen(false); nav('/gigs?new=1') }}>New Gig</button>
        </div>
      )}
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/rehearsals" element={<RehealsalsWrapper/>} />
          <Route path="/rehearsals/:id" element={<RehearsalDetail/>} />
          <Route path="/gigs" element={<GigsList/>} />
          <Route path="/gigs/:id" element={<GigDetail/>} />
          <Route path="/settings" element={<Settings/>} />
        </Routes>
      </main>
    </div>
  )
}

function RehealsalsWrapper() { return <RehearsalsList /> }
