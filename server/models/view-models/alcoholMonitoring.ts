import { createGovukErrorSummary } from '../../utils/errors'
import { deserialiseDateTime, getError } from '../../utils/utils'
import { AlcoholMonitoring } from '../AlcoholMonitoring'
import { AlcoholMonitoringFormData } from '../form-data/alcoholMonitoring'
import { ValidationResult } from '../Validation'
import { DateTimeField, ViewModel } from './utils'

type AlcoholMonitoringViewModel = ViewModel<Pick<AlcoholMonitoring, 'monitoringType'>> & {
  startDate: DateTimeField
  endDate: DateTimeField
}

const createViewModelFromAlcoholMonitoring = (
  monitoringConditionsAlcohol: AlcoholMonitoring,
): AlcoholMonitoringViewModel => {
  const startDate = deserialiseDateTime(monitoringConditionsAlcohol?.startDate)
  const endDate = deserialiseDateTime(monitoringConditionsAlcohol?.endDate)

  return {
    monitoringType: { value: monitoringConditionsAlcohol?.monitoringType ?? '' },
    startDate: { value: startDate },
    endDate: { value: endDate },
    errorSummary: null,
  }
}

const createViewModelFromFormData = (
  formData: AlcoholMonitoringFormData,
  validationErrors: ValidationResult,
): AlcoholMonitoringViewModel => {
  return {
    monitoringType: { value: formData.monitoringType ?? '', error: getError(validationErrors, 'monitoringType') },
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

const construct = (
  monitoringConditionsAlcohol: AlcoholMonitoring,
  validationErrors: ValidationResult,
  formData: [AlcoholMonitoringFormData],
): AlcoholMonitoringViewModel => {
  if (validationErrors.length > 0 && formData.length > 0) {
    return createViewModelFromFormData(formData[0], validationErrors)
  }

  return createViewModelFromAlcoholMonitoring(monitoringConditionsAlcohol)
}

export default {
  construct,
}
