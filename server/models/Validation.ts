import z from 'zod'

export const ValidationErrorModel = z.object({
  error: z.string(),
  field: z.string(),
  focusTarget: z.string().optional(),
})

export const ListItemValidationErrorModel = z.object({
  errors: z.array(ValidationErrorModel),
  index: z.number().int(),
})

export const ValidationResultModel = z.array(ValidationErrorModel)

export type ValidationError = z.infer<typeof ValidationErrorModel>

export type ValidationResult = z.infer<typeof ValidationResultModel>

export const ListValidationResultModel = z.array(ListItemValidationErrorModel)

export type ListItemValidationError = z.infer<typeof ListItemValidationErrorModel>

export type ListValidationResult = z.infer<typeof ListValidationResultModel>

// type-guard
export const isValidationResult = (result: unknown): result is ValidationResult => {
  return (
    Array.isArray(result) &&
    result.every(r => (r as ValidationError).field !== undefined && (r as ValidationError).error !== undefined)
  )
}

export const isValidationListResult = (result: unknown): result is ListValidationResult => {
  return (
    Array.isArray(result) &&
    result.every(
      r => (r as ListItemValidationError).errors !== undefined && (r as ListItemValidationError).index !== undefined,
    )
  )
}
