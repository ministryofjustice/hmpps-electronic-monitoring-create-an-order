import { ZodError } from 'zod'
import { ValidationResult } from '../models/Validation'
import { ErrorSummary } from './govukFrontEndTypes/errorSummary'

export const convertZodErrorToValidationError = (error: ZodError): ValidationResult => {
  return error.issues.reduce((acc, issue) => {
    acc.push({
      error: issue.message,
      field: issue.path.join('_').toString(),
    })
    return acc
  }, [] as ValidationResult)
}

export const createGovukErrorSummary = (validationErrors: ValidationResult): ErrorSummary | null => {
  if (validationErrors.length === 0) {
    return null
  }

  return {
    titleText: 'There is a problem',
    errorList: validationErrors.map(error => {
      return {
        href: `#${error.field}`,
        text: error.error,
      }
    }),
  }
}
