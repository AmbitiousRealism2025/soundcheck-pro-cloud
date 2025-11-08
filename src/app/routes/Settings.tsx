import { useState } from 'react'

export default function Settings() {
  const [home, setHome] = useState(localStorage.getItem('homeAddress') ?? '')
  const [seen, setSeen] = useState(localStorage.getItem('hasSeenTour') === 'true')

  const save = () => {
    localStorage.setItem('homeAddress', home)
    alert('Saved!')
  }
  const resetTour = () => {
    setSeen(false)
    localStorage.removeItem('hasSeenTour')
    alert('Tour will replay on next visit.')
  }

  return (
    <div className="grid gap-4 max-w-xl">
      <div className="card">
        <div className="font-semibold mb-2">Settings</div>
        <label className="label" htmlFor="home">Home Address</label>
        <input id="home" className="input" value={home} onChange={e=>setHome(e.target.value)} placeholder="123 Main St, City"/>
        <div className="mt-3"><button className="button" onClick={save}>Save</button></div>
      </div>
      <div className="card">
        <div className="font-medium">Onboarding Tour</div>
        <div className="text-sm opacity-80 mb-2">Seen: {String(seen).toLowerCase()}</div>
        <button className="button" onClick={resetTour}>Replay Tour</button>
      </div>
    </div>
  )
}
