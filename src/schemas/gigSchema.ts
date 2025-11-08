import { z } from 'zod'

const toISOWithOffset = (value: unknown) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return value
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString()
}

const isoDateTimeField = (message: string) =>
  z.preprocess(
    toISOWithOffset,
    z.string().datetime({
      offset: true,
      message,
    })
  )

/**
 * Zod schema for Venue validation
 */
export const venueSchema = z.object({
  name: z.string().min(1, 'Venue name is required').max(100),
  address: z.string().max(300).optional(),
  contact: z.string().max(100).optional(),
})

/**
 * Zod schema for Compensation validation
 */
export const compensationSchema = z.object({
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.string().default('USD'),
  status: z.enum(['pending', 'paid']).default('pending'),
  paidAt: z.number().optional(),
  method: z.string().optional(),
})

/**
 * Zod schema for Gig validation
 */
export const gigSchema = z.object({
  date: isoDateTimeField(
    'Date must be a valid ISO8601 string with timezone (e.g., 2024-05-01T19:00:00Z)'
  ),
  callTime: isoDateTimeField(
    'Call time must be a valid ISO8601 string with timezone (e.g., 2024-05-01T18:00:00Z)'
  ).optional(),
  venue: venueSchema,
  compensation: compensationSchema.optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).default('pending'),
  notes: z.string().optional(),
  mileage: z.number().min(0).optional(),
})

/**
 * Schema for creating a new gig
 */
export const createGigSchema = gigSchema

/**
 * Schema for updating a gig (all fields optional except what's being updated)
 */
export const updateGigSchema = gigSchema.partial().extend({
  id: z.string(),
})

/**
 * Infer TypeScript types from schemas
 */
export type GigFormData = z.infer<typeof gigSchema>
export type CreateGigFormData = z.infer<typeof createGigSchema>
export type UpdateGigFormData = z.infer<typeof updateGigSchema>
export type VenueFormData = z.infer<typeof venueSchema>
export type CompensationFormData = z.infer<typeof compensationSchema>
