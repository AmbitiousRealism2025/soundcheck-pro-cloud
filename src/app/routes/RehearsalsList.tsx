import { useEffect, useMemo, useState } from 'react'
import { useStore } from '@/store/useStore'
import { uid } from '@/utils/id'
import type { Rehearsal, Task } from '@/types'
import { Link, useSearchParams } from 'react-router-dom'
import { fmtDate } from '@/utils/dates'

export default function RehearsalsList() {
  const { rehearsals, load, addRehearsal } = useStore()
  const [params, setParams] = useSearchParams()
  const [creating, setCreating] = useState(params.get('new') === '1')

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (params.get('new') === '1') setCreating(true)
  }, [params])

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name = (form.querySelector('#eventName') as HTMLInputElement).value
    const date = (form.querySelector('#date') as HTMLInputElement).value
    const location = (form.querySelector('#location') as HTMLInputElement).value
    const now = Date.now()
    const r: Rehearsal = { id: uid('rehearsal'), eventName: name, date, location, tasks: [], createdAt: now, updatedAt: now }
    await addRehearsal(r)
    setCreating(false)
    params.delete('new'); setParams(params)
  }

  const sorted = useMemo(() => [...rehearsals].sort((a,b) => a.date.localeCompare(b.date)), [rehearsals])

  return (
    <div className="grid gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Rehearsals</h1>
        <button className="button" onClick={() => setCreating(v => !v)}>New Rehearsal</button>
      </header>

      {creating && (
        <form onSubmit={onCreate} className="card grid gap-3 max-w-xl">
          <div><label className="label" htmlFor="eventName">Event Name</label><input id="eventName" className="input" required/></div>
          <div><label className="label" htmlFor="date">Date/Time (ISO)</label><input id="date" className="input" placeholder="2025-06-14T18:00:00.000Z" required/></div>
          <div><label className="label" htmlFor="location">Location</label><input id="location" className="input" placeholder="Studio 5"/></div>
          <div><button className="button" type="submit">Save</button></div>
        </form>
      )}

      <div className="grid gap-3">
        {sorted.map(r => (
          <Link key={r.id} to={`/rehearsals/${r.id}`} className="card block">
            <div className="flex items-center justify-between">
              <div className="font-medium">{r.eventName}</div>
              <div className="text-sm opacity-80">{fmtDate(r.date)}</div>
            </div>
            {!!r.location && <div className="text-sm opacity-80 mt-1">{r.location}</div>}
            <div className="text-xs opacity-60 mt-2">{r.tasks.filter(t => t.status === 'open').length} open tasks</div>
          </Link>
        ))}
        {sorted.length === 0 && <div className="opacity-70">No rehearsals yet.</div>}
      </div>
    </div>
  )
}
