import { FormField, TextField, ViewModel } from './utils'
import { ValidationResult } from '../Validation'
import { TrailMonitoring } from '../TrailMonitoring'
import { deserialiseDateTime, getError } from '../../utils/utils'
import { TrailMonitoringFormData } from '../form-data/trailMonitoring'
import { createGovukErrorSummary } from '../../utils/errors'

type TrailMonitoringViewModel = ViewModel<unknown> & {
  startDate?: FormField
  startDateDay: TextField
  startDateMonth: TextField
  startDateYear: TextField
  endDate?: FormField
  endDateDay?: TextField
  endDateMonth?: TextField
  endDateYear?: TextField
}

const createViewModelFromFormData = (
  formData: TrailMonitoringFormData,
  validationErrors: ValidationResult,
): TrailMonitoringViewModel => {
  return {
    startDate: { error: getError(validationErrors, 'startDate') },
    startDateDay: { value: formData['startDate-day'] ?? '' },
    startDateMonth: { value: formData['startDate-month'] ?? '' },
    startDateYear: { value: formData['startDate-year'] ?? '' },
    endDate: { error: getError(validationErrors, 'endDate') },
    endDateDay: { value: formData['endDate-day'] ?? '' },
    endDateMonth: { value: formData['endDate-month'] ?? '' },
    endDateYear: { value: formData['endDate-year'] ?? '' },
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createViewModelFromTrailMonitoring = (trailMonitoring: TrailMonitoring): TrailMonitoringViewModel => {
  const startDate = deserialiseDateTime(trailMonitoring?.startDate)
  const endDate = deserialiseDateTime(trailMonitoring?.endDate)

  return {
    startDateDay: { value: startDate.day },
    startDateMonth: { value: startDate.month },
    startDateYear: { value: startDate.year },
    endDateDay: { value: endDate.day },
    endDateMonth: { value: endDate.month },
    endDateYear: { value: endDate.year },
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
