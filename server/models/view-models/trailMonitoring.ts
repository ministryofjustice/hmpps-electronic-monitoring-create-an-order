import { DateTimeField, TextField, ViewModel } from './utils'
import { ValidationResult } from '../Validation'
import { TrailMonitoring } from '../TrailMonitoring'
import { deserialiseDateTime, getError } from '../../utils/utils'
import { TrailMonitoringFormData } from '../form-data/trailMonitoring'
import { createGovukErrorSummary } from '../../utils/errors'
import { NotifyingOrganisation } from '../NotifyingOrganisation'

type TrailMonitoringViewModel = ViewModel<unknown> & {
  startDate: DateTimeField
  endDate: DateTimeField
  deviceType: TextField
  notifyingOrganisation: string | undefined
}

const createViewModelFromFormData = (
  formData: TrailMonitoringFormData,
  validationErrors: ValidationResult,
  notifyingOrganisation?: NotifyingOrganisation,
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
    deviceType: {
      value: formData.deviceType ?? '',
      error: getError(validationErrors, 'deviceType'),
    },
    notifyingOrganisation,
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createViewModelFromTrailMonitoring = (
  trailMonitoring: TrailMonitoring,
  notifyingOrganisation?: NotifyingOrganisation,
): TrailMonitoringViewModel => {
  return {
    startDate: { value: deserialiseDateTime(trailMonitoring?.startDate) },
    endDate: { value: deserialiseDateTime(trailMonitoring?.endDate) },
    deviceType: { value: trailMonitoring?.deviceType ?? '' },
    notifyingOrganisation,
    errorSummary: null,
  }
}

const construct = (
  trailMonitoring: TrailMonitoring,
  validationErrors: ValidationResult,
  formData: [TrailMonitoringFormData],
  notifyingOrganisation?: NotifyingOrganisation,
): TrailMonitoringViewModel => {
  if (validationErrors.length > 0 && formData.length > 0) {
    return createViewModelFromFormData(formData[0], validationErrors, notifyingOrganisation)
  }

  return createViewModelFromTrailMonitoring(trailMonitoring, notifyingOrganisation)
}

export default {
  construct,
}
