import { describe, expect, it } from 'vitest'

import type { Gig } from '@/types'
import { getGigIcsTiming } from './GigDetail'

type GigWithOptionalEnd = Gig & { end?: string }

const buildGig = (overrides: Partial<GigWithOptionalEnd> = {}): GigWithOptionalEnd => ({
  id: 'gig-1',
  date: '2025-01-01T18:00:00.000Z',
  venue: { name: 'Test Venue' },
  status: 'confirmed',
  createdAt: 0,
  updatedAt: 0,
  ...overrides,
})

describe('getGigIcsTiming', () => {
  it('uses callTime as end when it is after the start', () => {
    const gig = buildGig({
      callTime: '2025-01-01T20:00:00.000Z',
    })

    expect(getGigIcsTiming(gig)).toEqual({ endISO: '2025-01-01T20:00:00.000Z' })
  })

  it('falls back to default duration when callTime is missing or before the start', () => {
    const gigNoCallTime = buildGig({ callTime: undefined })
    const gigEarlyCall = buildGig({
      callTime: '2025-01-01T17:00:00.000Z',
    })

    expect(getGigIcsTiming(gigNoCallTime)).toEqual({ durationMinutes: 120 })
    expect(getGigIcsTiming(gigEarlyCall)).toEqual({ durationMinutes: 120 })
  })

  it('prefers a dedicated gig end time when provided and after the start', () => {
    const gig = buildGig({
      callTime: undefined,
      end: '2025-01-01T22:00:00.000Z',
    })

    expect(getGigIcsTiming(gig)).toEqual({ endISO: '2025-01-01T22:00:00.000Z' })
  })
})
