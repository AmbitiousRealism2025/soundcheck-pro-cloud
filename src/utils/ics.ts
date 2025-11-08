import { createEvent } from 'ics'
import { toSafeFilename, sanitizePlainText } from './sanitize'

export interface DownloadIcsOptions {
  title: string
  startISO: string
  endISO?: string
  durationMinutes?: number
  location?: string
  description?: string
  filename?: string
  tzid?: string
}

export type DownloadIcsResult =
  | { ok: true }
  | { ok: false; error: string }

export async function downloadIcs(opts: DownloadIcsOptions): Promise<DownloadIcsResult> {
  try {
    if (!opts.startISO) {
      return { ok: false, error: 'Missing event start time' }
    }

    const start = new Date(opts.startISO)
    if (Number.isNaN(start.getTime())) {
      return { ok: false, error: 'Invalid event start time' }
    }

    let end: Date
    if (opts.endISO) {
      end = new Date(opts.endISO)
      if (Number.isNaN(end.getTime())) {
        return { ok: false, error: 'Invalid event end time' }
      }
    } else if (typeof opts.durationMinutes === 'number' && opts.durationMinutes > 0) {
      end = new Date(start.getTime() + opts.durationMinutes * 60 * 1000)
    } else {
      // Default duration: 2 hours
      end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
    }

    // ICS library expects local date-time components or can work with tzid.
    const startComponents: [number, number, number, number, number] = [
      start.getUTCFullYear(),
      start.getUTCMonth() + 1,
      start.getUTCDate(),
      start.getUTCHours(),
      start.getUTCMinutes(),
    ]

    const endComponents: [number, number, number, number, number] = [
      end.getUTCFullYear(),
      end.getUTCMonth() + 1,
      end.getUTCDate(),
      end.getUTCHours(),
      end.getUTCMinutes(),
    ]

    const title =
      sanitizePlainText(opts.title, { maxLength: 120 }) ||
      'Event'
    const description = sanitizePlainText(opts.description, {
      maxLength: 2000,
      allowNewlines: true,
    })
    const location = sanitizePlainText(opts.location, { maxLength: 256 })

    const { value, error } = createEvent({
      title,
      start: startComponents,
      end: endComponents,
      location: location || undefined,
      description: description || undefined,
      // When tzid is provided, consumers can interpret accordingly.
      // The ics library supports tzid on event level in newer versions.
      // @ts-expect-error: tzid may not be typed depending on version.
      tzid: opts.tzid,
    })

    if (error || !value) {
      console.error('ICS generation error:', error)
      return { ok: false, error: 'Failed to generate calendar file' }
    }

    const filename =
      opts.filename ||
      toSafeFilename(title || 'event', '.ics')

    const blob = new Blob([value], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    return { ok: true }
  } catch (err) {
    console.error('ICS download error:', err)
    return { ok: false, error: 'Unexpected error generating calendar file' }
  }
}
