export default function Home() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Rehearsals</h2>
        <p className="text-sm opacity-80">Plan practice with draggable tasks and quick check-offs.</p>
      </section>
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Gigs</h2>
        <p className="text-sm opacity-80">Lock down call times, venue, pay, and one-tap directions.</p>
      </section>
    </div>
  )
}
