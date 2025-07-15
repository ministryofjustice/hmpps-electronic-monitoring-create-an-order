import { ValidationResult } from '../../models/Validation'

const focusTargetMap: Record<string, string> = {
  appointmentDate: 'day',
  dateOfBirth: 'day',
  endDate: 'day',
  releaseDate: 'day',
  startDate: 'day',
  variationDate: 'day',

  endTime: 'seconds',
  startTime: 'seconds',
}

export default function processBackendValidationErrors(errors: ValidationResult): ValidationResult {
  return errors.map(error => {
    const focusTarget = focusTargetMap[error.field]

    return focusTarget
      ? {
          ...error,
          focusTarget: `${error.field}-${focusTarget}`,
        }
      : error
  })
}
