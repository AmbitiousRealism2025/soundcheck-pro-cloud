import { describe, it, expect } from 'vitest'
import { uid } from './id'

describe('id utils', () => {
  describe('uid', () => {
    it('should generate unique id with default prefix', () => {
      const id1 = uid()
      const id2 = uid()

      expect(id1).toMatch(/^id-/)
      expect(id2).toMatch(/^id-/)
      expect(id1).not.toBe(id2)
    })

    it('should generate unique id with custom prefix', () => {
      const id = uid('rehearsal')
      expect(id).toMatch(/^rehearsal-/)
    })

    it('should generate unique ids on multiple calls', () => {
      const ids = new Set()
      for (let i = 0; i < 100; i++) {
        ids.add(uid())
      }
      expect(ids.size).toBe(100)
    })

    it('should handle empty prefix', () => {
      const id = uid('')
      expect(id).toMatch(/^-/)
    })

    it('should generate ids with different prefixes', () => {
      const rehearsalId = uid('rehearsal')
      const gigId = uid('gig')
      const taskId = uid('task')

      expect(rehearsalId).toMatch(/^rehearsal-/)
      expect(gigId).toMatch(/^gig-/)
      expect(taskId).toMatch(/^task-/)
    })

    it('should generate ids of consistent format', () => {
      const id = uid()
      // Format: prefix-randomstring-timestamp
      const parts = id.split('-')
      expect(parts.length).toBeGreaterThanOrEqual(2)
      expect(parts[0]).toBe('id')
    })
  })
})
