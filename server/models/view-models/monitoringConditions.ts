import { getErrorsViewModel } from '../../utils/utils'
import { MonitoringConditionsFormData } from '../form-data/monitoringConditions'
import { MonitoringConditions } from '../MonitoringConditions'
import { ValidationResult } from '../Validation'

const deserialiseDateTime = (dateString: string | null) => {
  if (dateString === null || dateString === '') {
    return {
      hours: '',
      minutes: '',
      day: '',
      month: '',
      year: '',
    }
  }

  const date = new Date(dateString)

  return {
    minutes: date.getMinutes().toString(),
    hours: date.getHours().toString(),
    day: date.getDate().toString(),
    month: (date.getMonth() + 1).toString(),
    year: date.getFullYear().toString(),
  }
}

const parseMonitoringRequired = (monitoringConditions: MonitoringConditions): string[] => {
  const monitoringTypes: (keyof MonitoringConditions)[] = [
    'curfew',
    'exclusionZone',
    'trail',
    'mandatoryAttendance',
    'alcohol',
  ]

  return monitoringTypes.reduce((acc: string[], val) => {
    if (monitoringConditions[val]) {
      acc.push(val)
    }
    return acc
  }, [])
}

const createViewModelFromMonitoringConditions = (monitoringConditions: MonitoringConditions) => ({
  ...monitoringConditions,
  startDate: deserialiseDateTime(monitoringConditions.startDate),
  endDate: deserialiseDateTime(monitoringConditions.endDate),
  monitoringRequired: parseMonitoringRequired(monitoringConditions),
  errors: {},
})

const createViewModelFromFormData = (formData: MonitoringConditionsFormData, errors: ValidationResult) => {
  const viewModelErrors = getErrorsViewModel(errors)

  if (viewModelErrors.updateMonitoringConditionsDto) {
    viewModelErrors.monitoringRequired = viewModelErrors.updateMonitoringConditionsDto
  }

  return {
    ...formData,
    errors: viewModelErrors,
  }
}

const createViewModel = (
  monitoringConditions: MonitoringConditions,
  formData: MonitoringConditionsFormData,
  errors: ValidationResult,
) => {
  if (errors.length > 0) {
    return createViewModelFromFormData(formData, errors)
  }

  return createViewModelFromMonitoringConditions(monitoringConditions)
}

export default createViewModel
