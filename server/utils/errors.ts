import { ZodError, ZodIssue } from 'zod'
import { ValidationError, ValidationResult, ValidationResultModel } from '../models/Validation'
import { ErrorSummary } from './govukFrontEndTypes/errorSummary'
import { SanitisedError } from '../sanitisedError'

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

export const convertBackendErrorToValidationError = (sanitisedError: SanitisedError): ValidationResult => {
  const focusTargetMap: Record<string, string> = {
    appointmentDate: 'day',
    dateOfBirth: 'day',
    endDate: 'day',
    releaseDate: 'day',
    startDate: 'day',
    variationDate: 'day',
    startTime: 'hours',
    endTime: 'hours',
  }

  const parsedErrors = ValidationResultModel.parse(sanitisedError.data)
  return parsedErrors.map(error => {
    const focusTarget = focusTargetMap[error.field]

    return focusTarget
      ? {
          ...error,
          focusTarget: `${error.field}-${focusTarget}`,
        }
      : error
  })
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
