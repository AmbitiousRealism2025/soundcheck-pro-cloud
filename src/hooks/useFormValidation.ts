import { useForm, UseFormProps, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'

/**
 * Custom hook for React Hook Form with Zod validation
 * Wraps useForm with zodResolver for easy Zod schema integration
 *
 * @param schema - Zod schema for validation
 * @param options - Additional options to pass to useForm
 * @returns UseFormReturn from react-hook-form
 *
 * @example
 * const form = useFormValidation(createRehearsalSchema, {
 *   defaultValues: { eventName: '', date: '', tasks: [] }
 * })
 */
export function useFormValidation<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>
): UseFormReturn<z.infer<TSchema>> {
  return useForm<z.infer<TSchema>>({
    ...options,
    resolver: zodResolver(schema) as any,
  })
}
