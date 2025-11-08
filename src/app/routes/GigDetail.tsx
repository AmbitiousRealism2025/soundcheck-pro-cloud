import { useParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { fmtDate } from '@/utils/dates'
import { directionsLink } from '@/utils/maps'
import { downloadIcs } from '@/utils/ics'

export default function GigDetail() {
  const { id } = useParams()
  const { gigs } = useStore()
  const gig = gigs.find(g => g.id === id)
  if (!gig) return <div>Gig not found.</div>

  const venueTitle = gig.venue?.name ?? 'Gig'

  return (
    <div className="grid gap-4 max-w-2xl">
      <div className="card">
        <div className="text-lg font-semibold">{venueTitle}</div>
        <div className="text-sm opacity-80">{fmtDate(gig.date)} {gig.venue?.address ? `• ${gig.venue.address}` : ''}</div>
        {gig.notes && <div className="text-sm opacity-80 mt-2">{gig.notes}</div>}
      </div>
      <div className="flex gap-2">
        {gig.venue?.address && (
          <a className="button" href={directionsLink(gig.venue.address)} target="_blank">Directions</a>
        )}
        <button
          className="button"
          onClick={() => downloadIcs({
            title: `Gig: ${venueTitle}`,
            startISO: gig.date,
            endISO: gig.callTime ?? gig.date,
            location: gig.venue?.address,
            description: gig.notes,
            filename: `gig-${venueTitle.replace(/\s+/g,'-').toLowerCase()}.ics`
          })}
        >Export .ics</button>
      </div>
      {gig.compensation !== undefined && (
        <div className="card">Compensation: ${'{'}gig.compensation{'}'}</div>
      )}
    </div>
  )
}
