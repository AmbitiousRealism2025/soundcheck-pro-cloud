import { describe, it, expect } from 'vitest'
import {
  calculateRehearsalCompletionRate,
  getRehearsalCompletionData,
  calculateEarningsByMonth,
  calculateTotalEarnings,
  calculateTotalMileage,
  getGigStatistics,
  getRehearsalStatistics,
  getTopEarningVenues,
} from './analytics'
import type { Rehearsal, Gig, MileageLog } from '@/types'

describe('analytics utils', () => {
  describe('calculateRehearsalCompletionRate', () => {
    it('should return 0 when no rehearsals', () => {
      expect(calculateRehearsalCompletionRate([])).toBe(0)
    })

    it('should return 0 when no tasks', () => {
      const rehearsals: Rehearsal[] = [
        { id: '1', eventName: 'Test', date: '2025-11-08', tasks: [], createdAt: Date.now(), updatedAt: Date.now() },
      ]
      expect(calculateRehearsalCompletionRate(rehearsals)).toBe(0)
    })

    it('should calculate 100% when all tasks completed', () => {
      const rehearsals: Rehearsal[] = [
        {
          id: '1',
          eventName: 'Test',
          date: '2025-11-08',
          tasks: [
            { id: '1', title: 'Task 1', status: 'closed', order: 0, createdAt: Date.now() },
            { id: '2', title: 'Task 2', status: 'closed', order: 1, createdAt: Date.now() },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ]
      expect(calculateRehearsalCompletionRate(rehearsals)).toBe(100)
    })

    it('should calculate 50% when half tasks completed', () => {
      const rehearsals: Rehearsal[] = [
        {
          id: '1',
          eventName: 'Test',
          date: '2025-11-08',
          tasks: [
            { id: '1', title: 'Task 1', status: 'closed', order: 0, createdAt: Date.now() },
            { id: '2', title: 'Task 2', status: 'open', order: 1, createdAt: Date.now() },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ]
      expect(calculateRehearsalCompletionRate(rehearsals)).toBe(50)
    })

    it('should calculate across multiple rehearsals', () => {
      const rehearsals: Rehearsal[] = [
        {
          id: '1',
          eventName: 'Test 1',
          date: '2025-11-08',
          tasks: [
            { id: '1', title: 'Task 1', status: 'closed', order: 0, createdAt: Date.now() },
            { id: '2', title: 'Task 2', status: 'closed', order: 1, createdAt: Date.now() },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: '2',
          eventName: 'Test 2',
          date: '2025-11-09',
          tasks: [
            { id: '3', title: 'Task 3', status: 'open', order: 0, createdAt: Date.now() },
            { id: '4', title: 'Task 4', status: 'open', order: 1, createdAt: Date.now() },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ]
      expect(calculateRehearsalCompletionRate(rehearsals)).toBe(50)
    })
  })

  describe('getRehearsalCompletionData', () => {
    it('should return empty array for no rehearsals', () => {
      expect(getRehearsalCompletionData([])).toEqual([])
    })

    it('should calculate completion data for each rehearsal', () => {
      const rehearsals: Rehearsal[] = [
        {
          id: '1',
          eventName: 'Test 1',
          date: '2025-11-08',
          tasks: [
            { id: '1', title: 'Task 1', status: 'closed', order: 0, createdAt: Date.now() },
            { id: '2', title: 'Task 2', status: 'open', order: 1, createdAt: Date.now() },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ]

      const result = getRehearsalCompletionData(rehearsals)
      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        id: '1',
        eventName: 'Test 1',
        percentage: 50,
        completed: 1,
        total: 2,
      })
    })
  })

  describe('calculateEarningsByMonth', () => {
    it('should return empty object for no gigs', () => {
      expect(calculateEarningsByMonth([])).toEqual({})
    })

    it('should calculate earnings by month', () => {
      const gigs: Gig[] = [
        {
          id: '1',
          eventName: 'Gig 1',
          date: '2025-11-08',
          venue: { name: 'Venue 1' },
          compensation: { amount: 500, currency: 'USD', status: 'paid' },
          status: 'completed',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: '2',
          eventName: 'Gig 2',
          date: '2025-11-15',
          venue: { name: 'Venue 2' },
          compensation: { amount: 300, currency: 'USD', status: 'paid' },
          status: 'completed',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ]

      const result = calculateEarningsByMonth(gigs)
      expect(result['Nov 2025']).toBe(800)
    })

    it('should only count paid gigs', () => {
      const gigs: Gig[] = [
        {
          id: '1',
          eventName: 'Gig 1',
          date: '2025-11-08',
          venue: { name: 'Venue 1' },
          compensation: { amount: 500, currency: 'USD', status: 'paid' },
          status: 'completed',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: '2',
          eventName: 'Gig 2',
          date: '2025-11-15',
          venue: { name: 'Venue 2' },
          compensation: { amount: 300, currency: 'USD', status: 'pending' },
          status: 'confirmed',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ]

      const result = calculateEarningsByMonth(gigs)
      expect(result['Nov 2025']).toBe(500)
    })
  })

  describe('calculateTotalEarnings', () => {
    it('should return zeros for no gigs', () => {
      const result = calculateTotalEarnings([])
      expect(result).toEqual({ total: 0, paid: 0, pending: 0, count: 0 })
    })

    it('should calculate total, paid, and pending', () => {
      const gigs: Gig[] = [
        {
          id: '1',
          eventName: 'Gig 1',
          date: '2025-11-08',
          venue: { name: 'Venue 1' },
          compensation: { amount: 500, currency: 'USD', status: 'paid' },
          status: 'completed',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: '2',
          eventName: 'Gig 2',
          date: '2025-11-15',
          venue: { name: 'Venue 2' },
          compensation: { amount: 300, currency: 'USD', status: 'pending' },
          status: 'confirmed',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ]

      const result = calculateTotalEarnings(gigs)
      expect(result).toEqual({ total: 800, paid: 500, pending: 300, count: 2 })
    })
  })

  describe('calculateTotalMileage', () => {
    it('should return zeros for no logs', () => {
      const result = calculateTotalMileage([])
      expect(result).toEqual({ totalDistance: 0, totalAmount: 0, count: 0 })
    })

    it('should calculate total distance and amount', () => {
      const logs: MileageLog[] = [
        {
          id: '1',
          gigId: '1',
          date: '2025-11-08',
          origin: 'Home',
          destination: 'Venue 1',
          distance: 25.5,
          rate: 0.67,
          amount: 17.09,
        },
        {
          id: '2',
          gigId: '2',
          date: '2025-11-15',
          origin: 'Home',
          destination: 'Venue 2',
          distance: 15.3,
          rate: 0.67,
          amount: 10.25,
        },
      ]

      const result = calculateTotalMileage(logs)
      expect(result.totalDistance).toBe(40.8)
      expect(result.totalAmount).toBe(27.34)
      expect(result.count).toBe(2)
    })
  })

  describe('getGigStatistics', () => {
    it('should return zeros for no gigs', () => {
      const result = getGigStatistics([])
      expect(result).toEqual({
        total: 0,
        upcoming: 0,
        completed: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
      })
    })

    it('should count gigs by status', () => {
      const gigs: Gig[] = [
        {
          id: '1',
          eventName: 'Gig 1',
          date: '2030-11-08',
          venue: { name: 'Venue 1' },
          status: 'confirmed',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: '2',
          eventName: 'Gig 2',
          date: '2020-11-08',
          venue: { name: 'Venue 2' },
          status: 'completed',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: '3',
          eventName: 'Gig 3',
          date: '2030-12-08',
          venue: { name: 'Venue 3' },
          status: 'pending',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ]

      const result = getGigStatistics(gigs)
      expect(result.total).toBe(3)
      expect(result.upcoming).toBe(2) // future dates
      expect(result.completed).toBe(1)
      expect(result.confirmed).toBe(1)
      expect(result.pending).toBe(1)
    })
  })

  describe('getRehearsalStatistics', () => {
    it('should return zeros for no rehearsals', () => {
      const result = getRehearsalStatistics([])
      expect(result).toEqual({
        total: 0,
        upcoming: 0,
        past: 0,
        totalTasks: 0,
        completedTasks: 0,
        openTasks: 0,
      })
    })

    it('should calculate rehearsal statistics', () => {
      const rehearsals: Rehearsal[] = [
        {
          id: '1',
          eventName: 'Future Rehearsal',
          date: '2030-11-08',
          tasks: [
            { id: '1', title: 'Task 1', status: 'closed', order: 0, createdAt: Date.now() },
            { id: '2', title: 'Task 2', status: 'open', order: 1, createdAt: Date.now() },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: '2',
          eventName: 'Past Rehearsal',
          date: '2020-11-08',
          tasks: [
            { id: '3', title: 'Task 3', status: 'closed', order: 0, createdAt: Date.now() },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ]

      const result = getRehearsalStatistics(rehearsals)
      expect(result.total).toBe(2)
      expect(result.upcoming).toBe(1)
      expect(result.past).toBe(1)
      expect(result.totalTasks).toBe(3)
      expect(result.completedTasks).toBe(2)
      expect(result.openTasks).toBe(1)
    })
  })

  describe('getTopEarningVenues', () => {
    it('should return empty array for no gigs', () => {
      expect(getTopEarningVenues([])).toEqual([])
    })

    it('should return top earning venues', () => {
      const gigs: Gig[] = [
        {
          id: '1',
          eventName: 'Gig 1',
          date: '2025-11-08',
          venue: { name: 'Venue A' },
          compensation: { amount: 500, currency: 'USD', status: 'paid' },
          status: 'completed',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: '2',
          eventName: 'Gig 2',
          date: '2025-11-15',
          venue: { name: 'Venue B' },
          compensation: { amount: 800, currency: 'USD', status: 'paid' },
          status: 'completed',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: '3',
          eventName: 'Gig 3',
          date: '2025-11-22',
          venue: { name: 'Venue A' },
          compensation: { amount: 600, currency: 'USD', status: 'paid' },
          status: 'completed',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ]

      const result = getTopEarningVenues(gigs, 2)
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Venue A')
      expect(result[0].total).toBe(1100)
      expect(result[0].count).toBe(2)
      expect(result[1].name).toBe('Venue B')
      expect(result[1].total).toBe(800)
    })

    it('should only count paid gigs', () => {
      const gigs: Gig[] = [
        {
          id: '1',
          eventName: 'Gig 1',
          date: '2025-11-08',
          venue: { name: 'Venue A' },
          compensation: { amount: 500, currency: 'USD', status: 'paid' },
          status: 'completed',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: '2',
          eventName: 'Gig 2',
          date: '2025-11-15',
          venue: { name: 'Venue A' },
          compensation: { amount: 800, currency: 'USD', status: 'pending' },
          status: 'confirmed',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ]

      const result = getTopEarningVenues(gigs)
      expect(result[0].total).toBe(500)
      expect(result[0].count).toBe(1)
    })
  })
})
