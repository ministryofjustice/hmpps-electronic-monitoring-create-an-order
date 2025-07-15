import { ValidationResult } from '../../models/Validation'

const focusTargetMap: Record<string, string> = {
  'End date must be after start date': 'day',
  'End date of monitoring must be in the future': 'day',
}

export default function processBackendValidationErrors(errors: ValidationResult): ValidationResult {
  return errors.map(error => {
    const focusTarget = focusTargetMap[error.error]

    return focusTargetMap[error.error]
      ? {
          ...error,
          focusTarget: `${error.field}-${focusTarget}`,
        }
      : error
  })
}
