import { DateTimeField, ViewModel } from './utils'
import { ValidationResult } from '../Validation'
import { TrailMonitoring } from '../TrailMonitoring'
import { deserialiseDateTime, getError } from '../../utils/utils'
import { TrailMonitoringFormData } from '../form-data/trailMonitoring'
import { createGovukErrorSummary } from '../../utils/errors'

type TrailMonitoringViewModel = ViewModel<unknown> & {
  startDate: DateTimeField
  endDate: DateTimeField
}

const createViewModelFromFormData = (
  formData: TrailMonitoringFormData,
  validationErrors: ValidationResult,
): TrailMonitoringViewModel => {
  return {
    startDate: {
      value: {
        day: formData.startDate.day,
        month: formData.startDate.month,
        year: formData.startDate.year,
        hours: formData.startDate.hours,
        minutes: formData.startDate.minutes,
      },
      error: getError(validationErrors, 'startDate'),
    },
    endDate: {
      value: {
        day: formData.endDate.day,
        month: formData.endDate.month,
        year: formData.endDate.year,
        hours: formData.endDate.hours,
        minutes: formData.endDate.minutes,
      },
      error: getError(validationErrors, 'endDate'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createViewModelFromTrailMonitoring = (trailMonitoring: TrailMonitoring): TrailMonitoringViewModel => {
  return {
    startDate: { value: deserialiseDateTime(trailMonitoring?.startDate) },
    endDate: { value: deserialiseDateTime(trailMonitoring?.endDate) },
    errorSummary: null,
  }
}

const construct = (
  trailMonitoring: TrailMonitoring,
  validationErrors: ValidationResult,
  formData: [TrailMonitoringFormData],
): TrailMonitoringViewModel => {
  if (validationErrors.length > 0 && formData.length > 0) {
    return createViewModelFromFormData(formData[0], validationErrors)
  }

  return createViewModelFromTrailMonitoring(trailMonitoring)
}

export default {
  construct,
}
