import { createGovukErrorSummary } from '../../utils/errors'
import { deserialiseDateTime, getError } from '../../utils/utils'
import { MonitoringConditionsFormData } from '../form-data/monitoringConditions'
import { MonitoringConditions } from '../MonitoringConditions'
import { ValidationResult } from '../Validation'
import { DateTimeField, MultipleChoiceField, ViewModel } from './utils'

type MonitoringConditionsViewModel = ViewModel<
  Pick<
    MonitoringConditions,
    'conditionType' | 'hdc' | 'issp' | 'orderType' | 'orderTypeDescription' | 'prarr' | 'sentenceType'
  >
> & {
  startDate: DateTimeField
  endDate: DateTimeField
  monitoringRequired: MultipleChoiceField
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

const createViewModelFromMonitoringConditions = (
  monitoringConditions: MonitoringConditions,
): MonitoringConditionsViewModel => ({
  conditionType: {
    value: monitoringConditions.conditionType || '',
  },
  endDate: {
    value: deserialiseDateTime(monitoringConditions.endDate),
  },
  hdc: {
    value: monitoringConditions.hdc || '',
  },
  issp: {
    value: monitoringConditions.issp || '',
  },
  monitoringRequired: {
    values: parseMonitoringRequired(monitoringConditions),
  },
  orderType: {
    value: monitoringConditions.orderType || '',
  },
  orderTypeDescription: {
    value: monitoringConditions.orderTypeDescription || '',
  },
  prarr: {
    value: monitoringConditions.prarr || '',
  },
  sentenceType: {
    value: monitoringConditions.sentenceType || '',
  },
  startDate: {
    value: deserialiseDateTime(monitoringConditions.startDate),
  },
  errorSummary: null,
})

const createViewModelFromFormData = (
  formData: MonitoringConditionsFormData,
  validationErrors: ValidationResult,
): MonitoringConditionsViewModel => {
  return {
    conditionType: {
      value: formData.conditionType,
      error: getError(validationErrors, 'conditionType'),
    },
    endDate: {
      value: formData.endDate,
      error: getError(validationErrors, 'endDate'),
      dateError: getError(validationErrors, 'endDate_date'),
      timeError: getError(validationErrors, 'endDate_time'),
    },
    hdc: {
      value: formData.hdc,
      error: getError(validationErrors, 'hdc'),
    },
    issp: {
      value: formData.issp,
      error: getError(validationErrors, 'issp'),
    },
    monitoringRequired: {
      values: formData.monitoringRequired,
      error:
        getError(validationErrors, 'monitoringRequired') || getError(validationErrors, 'updateMonitoringConditionsDto'),
    },
    orderType: {
      value: formData.orderType,
      error: getError(validationErrors, 'orderType'),
    },
    orderTypeDescription: {
      value: formData.orderTypeDescription,
      error: getError(validationErrors, 'orderTypeDescription'),
    },
    prarr: {
      value: formData.prarr,
      error: getError(validationErrors, 'prarr'),
    },
    sentenceType: {
      value: formData.sentenceType || '',
      error: getError(validationErrors, 'sentenceType'),
    },
    startDate: {
      value: formData.startDate,
      error: getError(validationErrors, 'startDate'),
      dateError: getError(validationErrors, 'startDate_date'),
      timeError: getError(validationErrors, 'startDate_time'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createViewModel = (
  monitoringConditions: MonitoringConditions,
  formData: MonitoringConditionsFormData,
  errors: ValidationResult,
): MonitoringConditionsViewModel => {
  if (errors.length > 0) {
    return createViewModelFromFormData(formData, errors)
  }

  return createViewModelFromMonitoringConditions(monitoringConditions)
}

export default createViewModel
