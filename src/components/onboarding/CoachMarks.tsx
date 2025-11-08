import { useEffect, useState } from 'react'
export default function CoachMarks() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (localStorage.getItem('hasSeenTour') === 'true') return
    setOpen(true)
  }, [])
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center p-4 z-50">
      <div className="card max-w-lg">
        <div className="font-semibold mb-2">Welcome to SoundCheck Pro</div>
        <ol className="list-decimal list-inside text-sm opacity-90 space-y-1">
          <li>Use **Rehearsals** to plan tasks for practice.</li>
          <li>Use **Gigs** to store logistics and export calendar events.</li>
          <li>Tap **Add** to create a new rehearsal or gig.</li>
        </ol>
        <div className="mt-3"><button className="button" onClick={() => { localStorage.setItem('hasSeenTour','true'); setOpen(false) }}>Got it</button></div>
      </div>
    </div>
  )
}
