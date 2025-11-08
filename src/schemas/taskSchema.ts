import { z } from 'zod'

/**
 * Zod schema for Task validation
 */
export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(100, 'Task title must be less than 100 characters'),
  note: z.string().optional(),
  status: z.enum(['open', 'closed']).default('open'),
  order: z.number().int().min(0),
})

/**
 * Schema for creating a new task (without ID)
 */
export const createTaskSchema = taskSchema

/**
 * Schema for updating a task (all fields optional except what's being updated)
 */
export const updateTaskSchema = taskSchema.partial().extend({
  id: z.string(),
})

/**
 * Infer TypeScript types from schemas
 */
export type TaskFormData = z.infer<typeof taskSchema>
export type CreateTaskFormData = z.infer<typeof createTaskSchema>
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>
