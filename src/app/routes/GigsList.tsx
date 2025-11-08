import { useEffect, useMemo, useState } from 'react'
import { useStore } from '@/store/useStore'
import { uid } from '@/utils/id'
import type { Gig } from '@/types'
import { Link, useSearchParams } from 'react-router-dom'
import { fmtDate } from '@/utils/dates'

export default function GigsList() {
  const { gigs, load, addGig } = useStore()
  const [params, setParams] = useSearchParams()
  const [creating, setCreating] = useState(params.get('new') === '1')

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (params.get('new') === '1') setCreating(true)
  }, [params])

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const f = e.target as HTMLFormElement
    const date = (f.querySelector('#date') as HTMLInputElement).value
    const callTime = (f.querySelector('#callTime') as HTMLInputElement).value
    const venueName = (f.querySelector('#venueName') as HTMLInputElement).value
    const venueAddress = (f.querySelector('#venueAddress') as HTMLInputElement).value
    const contact = (f.querySelector('#contact') as HTMLInputElement).value
    const compensation = parseFloat((f.querySelector('#comp') as HTMLInputElement).value || '0')
    const notes = (f.querySelector('#notes') as HTMLTextAreaElement).value
    const now = Date.now()
    const g: Gig = { id: uid('gig'), date, callTime, venue: { name: venueName, address: venueAddress, contact }, compensation, notes, createdAt: now, updatedAt: now }
    await addGig(g)
    setCreating(false)
    params.delete('new'); setParams(params)
  }

  const sorted = useMemo(() => [...gigs].sort((a,b) => a.date.localeCompare(b.date)), [gigs])

  return (
    <div className="grid gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Gigs</h1>
        <button className="button" onClick={() => setCreating(v => !v)}>New Gig</button>
      </header>

      {creating && (
        <form onSubmit={onCreate} className="card grid gap-3 max-w-xl">
          <div><label className="label" htmlFor="date">Date/Time (ISO)</label><input id="date" className="input" placeholder="2025-06-21T21:00:00.000Z" required/></div>
          <div><label className="label" htmlFor="callTime">Call Time (ISO)</label><input id="callTime" className="input" placeholder="2025-06-21T19:30:00.000Z"/></div>
          <div><label className="label" htmlFor="venueName">Venue Name</label><input id="venueName" className="input" required/></div>
          <div><label className="label" htmlFor="venueAddress">Venue Address</label><input id="venueAddress" className="input"/></div>
          <div><label className="label" htmlFor="contact">Contact (email/phone)</label><input id="contact" className="input"/></div>
          <div><label className="label" htmlFor="comp">Compensation (number)</label><input id="comp" className="input"/></div>
          <div><label className="label" htmlFor="notes">Notes</label><textarea id="notes" className="input" rows={3}></textarea></div>
          <div><button className="button" type="submit">Save</button></div>
        </form>
      )}

      <div className="grid gap-3">
        {sorted.map(g => (
          <Link key={g.id} to={`/gigs/${g.id}`} className="card block">
            <div className="flex items-center justify-between">
              <div className="font-medium">{g.venue?.name ?? 'Untitled Venue'}</div>
              <div className="text-sm opacity-80">{fmtDate(g.date)}</div>
            </div>
            {!!g.venue?.address && <div className="text-sm opacity-80 mt-1">{g.venue.address}</div>}
            {g.compensation !== undefined && <div className="text-xs opacity-60 mt-2">${g.compensation}</div>}
          </Link>
        ))}
        {sorted.length === 0 && <div className="opacity-70">No gigs yet.</div>}
      </div>
    </div>
  )
}
