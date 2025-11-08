import { z } from 'zod'
import { taskSchema } from './taskSchema'

/**
 * Zod schema for Rehearsal validation
 */
export const rehearsalSchema = z.object({
  eventName: z
    .string()
    .min(1, 'Event name is required')
    .max(100, 'Event name must be less than 100 characters'),
  date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/,
      'Date must be in ISO8601 format (YYYY-MM-DDTHH:mm)'
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
