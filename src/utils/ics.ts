import { createEvent } from 'ics'

export async function downloadIcs(opts: {
  title: string
  startISO: string
  endISO?: string
  location?: string
  description?: string
  filename: string
}) {
  const start = new Date(opts.startISO)
  const end = new Date(opts.endISO ?? start.getTime() + 2 * 60 * 60 * 1000)
  const { value, error } = createEvent({
    title: opts.title,
    start: [start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()],
    end: [end.getFullYear(), end.getMonth() + 1, end.getDate(), end.getHours(), end.getMinutes()],
    location: opts.location,
    description: opts.description,
  })
  if (error) throw error
  const blob = new Blob([value!], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = opts.filename
  a.click()
  URL.revokeObjectURL(url)
}
