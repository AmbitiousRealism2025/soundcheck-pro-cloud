import { describe, it, expect } from 'vitest'
import { fmtDate } from './dates'

describe('dates utils', () => {
  describe('fmtDate', () => {
    it('should format ISO date with default format', () => {
      const result = fmtDate('2025-11-08T14:30:00')
      expect(result).toMatch(/Nov 8, 2025/)
    })

    it('should format ISO date with custom format', () => {
      const result = fmtDate('2025-11-08T14:30:00', 'yyyy-MM-dd')
      expect(result).toBe('2025-11-08')
    })

    it('should format ISO date with time', () => {
      const result = fmtDate('2025-11-08T14:30:00', 'h:mma')
      expect(result).toMatch(/2:30[AP]M/)
    })

    it('should handle different date formats', () => {
      expect(fmtDate('2025-01-15T09:00:00', 'MMM d')).toBe('Jan 15')
      expect(fmtDate('2025-12-25T18:00:00', 'MMMM do, yyyy')).toBe('December 25th, 2025')
    })

    it('should return original string on invalid date', () => {
      const invalidDate = 'not-a-date'
      const result = fmtDate(invalidDate)
      expect(result).toBe(invalidDate)
    })

    it('should handle edge cases gracefully', () => {
      expect(fmtDate('')).toBe('')
      expect(fmtDate('invalid')).toBe('invalid')
      expect(fmtDate('2025-13-45')).toBe('2025-13-45') // invalid month/day
    })

    it('should handle different time zones', () => {
      const result = fmtDate('2025-11-08T14:30:00Z', 'yyyy-MM-dd')
      expect(result).toBe('2025-11-08')
    })
  })
})
