import { ZodError, ZodIssue } from 'zod'
import { ValidationError, ValidationResult } from '../models/Validation'
import { ErrorSummary } from './govukFrontEndTypes/errorSummary'

export const convertZodErrorToValidationError = (error: ZodError): ValidationResult => {
  type ZodIssueWithParams = ZodIssue & {
    params?: {
      focusPath?: string
    }
  }

  return error.issues.reduce((acc, issue) => {
    const fieldPath = issue.path.join('-').toString()
    const focusPath = (issue as ZodIssueWithParams).params?.focusPath

    const validationError: ValidationError = {
      error: issue.message,
      field: fieldPath,
    }

    if (focusPath) {
      validationError.focusTarget = `${fieldPath}-${focusPath}`
    }

    acc.push(validationError)
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
        href: error.focusTarget ? `#${error.focusTarget}` : `#${error.field}`,
        text: error.error,
      }
    }),
  }
}
