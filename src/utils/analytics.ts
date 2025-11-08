import type { Rehearsal, Gig, MileageLog } from '@/types'
import { startOfMonth, endOfMonth, format } from 'date-fns'

/**
 * Calculate rehearsal completion rate
 * Returns percentage of completed tasks across all rehearsals
 */
export function calculateRehearsalCompletionRate(rehearsals: Rehearsal[]): number {
  const allTasks = rehearsals.flatMap(r => r.tasks || [])
  if (allTasks.length === 0) return 0

  const completedTasks = allTasks.filter(t => t.status === 'closed')
  return Math.round((completedTasks.length / allTasks.length) * 100)
}

/**
 * Calculate completion rate by rehearsal
 * Returns array of rehearsals with their completion percentages
 */
export function getRehearsalCompletionData(rehearsals: Rehearsal[]) {
  return rehearsals.map(rehearsal => {
    const tasks = rehearsal.tasks || []
    const completed = tasks.filter(t => t.status === 'closed').length
    const total = tasks.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      id: rehearsal.id,
      eventName: rehearsal.eventName,
      date: rehearsal.date,
      percentage,
      completed,
      total,
    }
  })
}

/**
 * Calculate earnings by month
 * Returns object with month keys and total earnings
 */
export function calculateEarningsByMonth(gigs: Gig[]): Record<string, number> {
  const earningsByMonth: Record<string, number> = {}

  gigs.forEach(gig => {
    if (gig.compensation?.status === 'paid' && gig.compensation.amount > 0) {
      const monthKey = format(new Date(gig.date), 'MMM yyyy')
      earningsByMonth[monthKey] = (earningsByMonth[monthKey] || 0) + gig.compensation.amount
    }
  })

  return earningsByMonth
}

/**
 * Calculate total earnings
 * Returns total paid and pending amounts
 */
export function calculateTotalEarnings(gigs: Gig[]): {
  total: number
  paid: number
  pending: number
  count: number
} {
  let total = 0
  let paid = 0
  let pending = 0

  gigs.forEach(gig => {
    if (gig.compensation?.amount) {
      total += gig.compensation.amount

      if (gig.compensation.status === 'paid') {
        paid += gig.compensation.amount
      } else if (gig.compensation.status === 'pending') {
        pending += gig.compensation.amount
      }
    }
  })

  return {
    total,
    paid,
    pending,
    count: gigs.filter(g => g.compensation?.amount).length,
  }
}

/**
 * Calculate total mileage
 * Returns total distance and reimbursement amount
 */
export function calculateTotalMileage(mileageLogs: MileageLog[]): {
  totalDistance: number
  totalAmount: number
  count: number
} {
  let totalDistance = 0
  let totalAmount = 0

  mileageLogs.forEach(log => {
    totalDistance += log.distance
    totalAmount += log.amount
  })

  return {
    totalDistance: Math.round(totalDistance * 10) / 10,
    totalAmount: Math.round(totalAmount * 100) / 100,
    count: mileageLogs.length,
  }
}

/**
 * Get gig statistics
 * Returns counts by status and other metrics
 */
export function getGigStatistics(gigs: Gig[]) {
  const now = new Date()

  return {
    total: gigs.length,
    upcoming: gigs.filter(g => new Date(g.date) > now).length,
    completed: gigs.filter(g => g.status === 'completed').length,
    confirmed: gigs.filter(g => g.status === 'confirmed').length,
    pending: gigs.filter(g => g.status === 'pending').length,
    cancelled: gigs.filter(g => g.status === 'cancelled').length,
  }
}

/**
 * Get rehearsal statistics
 * Returns counts and completion metrics
 */
export function getRehearsalStatistics(rehearsals: Rehearsal[]) {
  const now = new Date()
  const allTasks = rehearsals.flatMap(r => r.tasks || [])

  return {
    total: rehearsals.length,
    upcoming: rehearsals.filter(r => new Date(r.date) > now).length,
    past: rehearsals.filter(r => new Date(r.date) <= now).length,
    totalTasks: allTasks.length,
    completedTasks: allTasks.filter(t => t.status === 'closed').length,
    openTasks: allTasks.filter(t => t.status === 'open').length,
  }
}

/**
 * Get top earning venues
 * Returns venues sorted by total earnings
 */
export function getTopEarningVenues(gigs: Gig[], limit = 5) {
  const venueEarnings: Record<string, { name: string; total: number; count: number }> = {}

  gigs.forEach(gig => {
    if (gig.compensation?.amount && gig.compensation.status === 'paid') {
      const venueName = gig.venue.name
      if (!venueEarnings[venueName]) {
        venueEarnings[venueName] = { name: venueName, total: 0, count: 0 }
      }
      venueEarnings[venueName].total += gig.compensation.amount
      venueEarnings[venueName].count += 1
    }
  })

  return Object.values(venueEarnings)
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
}
