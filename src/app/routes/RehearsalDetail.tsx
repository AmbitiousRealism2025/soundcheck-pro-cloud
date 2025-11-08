import { useParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { useMemo, useState } from 'react'
import { fmtDate } from '@/utils/dates'
import { uid } from '@/utils/id'
import type { Task, TaskStatus } from '@/types'

export default function RehearsalDetail() {
  const { id } = useParams()
  const { rehearsals, updateRehearsal } = useStore()
  const rehearsal = rehearsals.find(r => r.id === id)
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')

  const tasks = useMemo(() => (rehearsal?.tasks ?? []).slice().sort((a,b)=>a.order-b.order), [rehearsal])

  if (!rehearsal) return <div>Rehearsal not found.</div>

  const addTask = async () => {
    if (!title.trim()) return
    const t: Task = { id: uid('task'), title, note, status: 'open', order: tasks.length }
    const updated = { ...rehearsal, tasks: [...rehearsal.tasks, t], updatedAt: Date.now() }
    await updateRehearsal(updated)
    setTitle(''); setNote('')
  }

  const toggle = async (tid: string) => {
    const updated = { ...rehearsal, tasks: rehearsal.tasks.map(t => t.id===tid ? { ...t, status: (t.status==='open' ? 'closed' : 'open') as TaskStatus } : t) , updatedAt: Date.now() }
    await updateRehearsal(updated)
  }

  return (
    <div className="grid gap-4 max-w-2xl">
      <div className="card">
        <div className="text-lg font-semibold">{rehearsal.eventName}</div>
        <div className="text-sm opacity-80">{fmtDate(rehearsal.date)} {rehearsal.location ? `• ${rehearsal.location}` : ''}</div>
      </div>

      <div className="card">
        <div className="font-medium mb-2">Tasks</div>
        <div className="grid gap-2">
          {tasks.map(t => (
            <label key={t.id} className="flex items-start gap-2">
              <input type="checkbox" checked={t.status==='closed'} onChange={() => toggle(t.id)} />
              <div>
                <div className={t.status==='closed' ? 'line-through opacity-60' : ''}>{t.title}</div>
                {t.note && <div className="text-xs opacity-70">{t.note}</div>}
              </div>
            </label>
          ))}
          {tasks.length===0 && <div className="opacity-70">No tasks yet.</div>}
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <input className="input" placeholder="Task title" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="input" placeholder="Optional note" value={note} onChange={e=>setNote(e.target.value)} />
          <div className="md:col-span-2"><button className="button" onClick={addTask}>Add Task</button></div>
        </div>
      </div>
    </div>
  )
}
