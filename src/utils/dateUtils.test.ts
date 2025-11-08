import { describe, expect, it } from 'vitest'
import { compareISO, inRange, isUpcoming } from './dateUtils'

describe('dateUtils', () => {
  describe('compareISO', () => {
    it('orders timestamps that use different offsets correctly', () => {
      const beforeDST = '2024-03-10T01:30:00-05:00'
      const afterDST = '2024-03-10T03:30:00-04:00'

      expect(compareISO(beforeDST, afterDST)).toBeLessThan(0)

      const sorted = [afterDST, beforeDST].sort(compareISO)
      expect(sorted).toEqual([beforeDST, afterDST])
    })

    it('places invalid timestamps after valid ones', () => {
      const values = ['invalid-date', '2024-01-01T00:00:00Z', '2024-01-02T00:00:00Z']
      const sorted = values.sort(compareISO)
      expect(sorted[sorted.length - 1]).toBe('invalid-date')
    })
  })

  describe('isUpcoming', () => {
    it('treats the boundary value as upcoming and earlier values as past', () => {
      const now = Date.parse('2024-11-01T12:00:00Z')
      expect(isUpcoming('2024-11-01T12:00:00Z', now)).toBe(true)
      expect(isUpcoming('2024-11-01T11:59:59Z', now)).toBe(false)
    })
  })

  describe('inRange', () => {
    it('handles DST transitions without string comparisons', () => {
      const start = '2024-03-10T05:00:00Z'
      const end = '2024-03-10T08:00:00Z'
      const duringDSTShift = '2024-03-10T02:30:00-05:00' // 07:30Z, during US DST jump

      expect(inRange(duringDSTShift, start, end)).toBe(true)
      expect(inRange('2024-03-10T04:59:59Z', start, end)).toBe(false)
      expect(inRange('2024-03-10T08:00:01Z', start, end)).toBe(false)
    })
  })
})
