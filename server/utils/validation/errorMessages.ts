import { ValidationResult } from '../../models/Validation'
import { ErrorMessage, ErrorsViewModel } from '../../models/view-models/utils'

export const getError = (validationErrors: ValidationResult, field: string): ErrorMessage | undefined => {
  const matchedError = validationErrors.find(e => e.field === field)

  if (matchedError) {
    return {
      text: matchedError.error,
    }
  }

  return undefined
}

export const getErrors = (validationErrors: ValidationResult, fields: string[]): ErrorMessage | undefined => {
  const matchedErrors = validationErrors.filter(e => fields.includes(e.field))

  if (matchedErrors.length > 0) {
    return {
      text: matchedErrors.map(e => e.error).join(', '),
    }
  }

  return undefined
}

export const getErrorsViewModel = (validationErrors: ValidationResult): ErrorsViewModel => {
  const viewModel: ErrorsViewModel = {}
  validationErrors.forEach(error => {
    viewModel[error.field] = { text: error.error }
  })
  return viewModel
}
