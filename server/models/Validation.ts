import z from 'zod'

export const ValidationErrorModel = z.object({
  field: z.string(),
  error: z.string(),
})

export const ValidationResultModel = z.array(ValidationErrorModel)

export type ValidationError = z.infer<typeof ValidationErrorModel>

export type ValidationResult = z.infer<typeof ValidationResultModel>

// type-guard
export const isValidationResult = (result: unknown): result is ValidationResult => {
  return (
    Array.isArray(result) &&
    result.every(r => (r as ValidationError).field !== undefined && (r as ValidationError).error !== undefined)
  )
}
