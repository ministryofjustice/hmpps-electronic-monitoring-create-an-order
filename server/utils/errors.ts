import { ZodError } from 'zod'
import { ValidationResult } from '../models/Validation'

// eslint-disable-next-line  import/prefer-default-export
export const convertZodErrorToValidationError = (error: ZodError): ValidationResult => {
  return error.issues.reduce((acc, issue) => {
    acc.push({
      error: issue.message,
      field: issue.path.join('_').toString(),
    })
    return acc
  }, [] as ValidationResult)
}
