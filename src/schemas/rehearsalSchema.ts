import { z } from 'zod'
import { taskSchema } from './taskSchema'

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
 * Zod schema for Rehearsal validation
 */
export const rehearsalSchema = z.object({
  eventName: z
    .string()
    .min(1, 'Event name is required')
    .max(100, 'Event name must be less than 100 characters'),
  date: isoDateTimeField(
    'Date must be a valid ISO8601 string with timezone (e.g., 2024-05-01T19:00:00Z)'
  ),
  location: z.string().max(200, 'Location must be less than 200 characters').optional(),
  tasks: z.array(taskSchema).default([]),
  templateId: z.string().optional(),
})

/**
 * Schema for creating a new rehearsal
 */
export const createRehearsalSchema = rehearsalSchema

/**
 * Schema for updating a rehearsal (all fields optional except what's being updated)
 */
export const updateRehearsalSchema = rehearsalSchema.partial().extend({
  id: z.string(),
})

/**
 * Infer TypeScript types from schemas
 */
export type RehearsalFormData = z.infer<typeof rehearsalSchema>
export type CreateRehearsalFormData = z.infer<typeof createRehearsalSchema>
export type UpdateRehearsalFormData = z.infer<typeof updateRehearsalSchema>
