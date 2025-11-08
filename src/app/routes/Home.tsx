import { UpcomingEventsWidget } from '@/components/dashboard/UpcomingEventsWidget'
import { OpenTasksWidget } from '@/components/dashboard/OpenTasksWidget'
import { EarningsWidget } from '@/components/dashboard/EarningsWidget'
import { TravelWidget } from '@/components/dashboard/TravelWidget'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { useRehearsals, useGigs } from '@/store/hooks'

export default function Home() {
  const { rehearsals } = useRehearsals()
  const { gigs } = useGigs()

  // Calculate quick stats
  const now = new Date()
  const thisWeekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const rehearsalsThisWeek = rehearsals.filter((r) => {
    const date = new Date(r.date)
    return date >= now && date <= thisWeekEnd
  }).length

  const upcomingGigs = gigs.filter((g) => {
    const date = new Date(g.date)
    return date >= now
  }).length

  // Get greeting based on time of day
  const hour = now.getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="glass rounded-xl p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {greeting}! 👋
        </h1>
        <p className="text-lg opacity-80 mb-6">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-white/5">
            <p className="text-sm opacity-60 mb-1">This Week</p>
            <p className="text-2xl font-bold">{rehearsalsThisWeek}</p>
            <p className="text-xs opacity-40">rehearsals</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <p className="text-sm opacity-60 mb-1">Upcoming</p>
            <p className="text-2xl font-bold">{upcomingGigs}</p>
            <p className="text-xs opacity-40">gigs</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <p className="text-sm opacity-60 mb-1">Total</p>
            <p className="text-2xl font-bold">{rehearsals.length}</p>
            <p className="text-xs opacity-40">rehearsals</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <p className="text-sm opacity-60 mb-1">Total</p>
            <p className="text-2xl font-bold">{gigs.length}</p>
            <p className="text-xs opacity-40">gigs</p>
          </div>
        </div>

        <QuickActions />
      </section>

      {/* Widgets Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-1">
          <UpcomingEventsWidget />
        </div>
        <div className="md:col-span-1">
          <OpenTasksWidget />
        </div>
        <div className="md:col-span-1">
          <EarningsWidget />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <TravelWidget />
        </div>
      </div>
    </div>
  )
}
