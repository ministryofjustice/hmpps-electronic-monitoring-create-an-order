import { createGovukErrorSummary } from '../../utils/errors'
import { deserialiseDateTime, getError } from '../../utils/utils'
import { MonitoringConditionsFormData } from '../form-data/monitoringConditions'
import { MonitoringConditions } from '../MonitoringConditions'
import { ValidationResult } from '../Validation'
import { DateTimeField, MultipleChoiceField, ViewModel } from './utils'
import config from '../../config'
import { Order } from '../Order'
import FeatureFlags from '../../utils/featureFlags'

type MonitoringConditionsViewModel = ViewModel<
  Pick<
    MonitoringConditions,
    'conditionType' | 'hdc' | 'issp' | 'orderType' | 'orderTypeDescription' | 'prarr' | 'sentenceType' | 'pilot'
  >
> & {
  startDate: DateTimeField
  endDate: DateTimeField
  monitoringRequired: MultipleChoiceField
  monitoringConditionTimes: boolean
  orderTypeEnabled: boolean
  alcoholEnabled: boolean
  DDv5: boolean
  fixedAddressExist: boolean
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

const hasFixedAddress = (order: Order): boolean => {
  const primaryAddress = order.addresses.find(({ addressType }) => addressType === 'PRIMARY')
  return primaryAddress !== undefined
}

const createViewModelFromMonitoringConditions = (order: Order): MonitoringConditionsViewModel => ({
  conditionType: {
    value: order.monitoringConditions.conditionType || '',
  },
  endDate: {
    value: deserialiseDateTime(order.monitoringConditions.endDate),
  },
  hdc: {
    value: order.monitoringConditions.hdc || '',
  },
  issp: {
    value: order.monitoringConditions.issp || '',
  },
  monitoringRequired: {
    values: parseMonitoringRequired(order.monitoringConditions),
  },
  orderType: {
    value: order.monitoringConditions.orderType || '',
  },
  orderTypeDescription: {
    value: order.monitoringConditions.orderTypeDescription || '',
  },
  prarr: {
    value: order.monitoringConditions.prarr || '',
  },
  sentenceType: {
    value: order.monitoringConditions.sentenceType || '',
  },
  startDate: {
    value: deserialiseDateTime(order.monitoringConditions.startDate),
  },
  pilot: {
    value: order.monitoringConditions.pilot || '',
  },
  errorSummary: null,
  monitoringConditionTimes: config.monitoringConditionTimes.enabled,
  orderTypeEnabled: FeatureFlags.getInstance().get('ORDER_TYPE_ENABLED'),
  alcoholEnabled: FeatureFlags.getInstance().get('ALCOHOL_MONITORING_ENABLED'),
  DDv5: order.dataDictionaryVersion === 'DDV5',
  fixedAddressExist: hasFixedAddress(order),
})

const createViewModelFromFormData = (
  formData: MonitoringConditionsFormData,
  validationErrors: ValidationResult,
  order: Order,
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
      value: formData.hdc || '',
      error: getError(validationErrors, 'hdc'),
    },
    issp: {
      value: formData.issp || '',
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
      value: formData.orderTypeDescription || '',
      error: getError(validationErrors, 'orderTypeDescription'),
    },
    prarr: {
      value: formData.prarr || '',
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
    pilot: {
      value: formData.pilot || '',
      error: getError(validationErrors, 'pilot'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
    monitoringConditionTimes: config.monitoringConditionTimes.enabled,
    orderTypeEnabled: FeatureFlags.getInstance().get('ORDER_TYPE_ENABLED'),
    alcoholEnabled: FeatureFlags.getInstance().get('ALCOHOL_MONITORING_ENABLED'),
    DDv5: order.dataDictionaryVersion === 'DDV5',
    fixedAddressExist: hasFixedAddress(order),
  }
}

const createViewModel = (
  order: Order,
  formData: MonitoringConditionsFormData,
  errors: ValidationResult,
): MonitoringConditionsViewModel => {
  if (errors.length > 0) {
    return createViewModelFromFormData(formData, errors, order)
  }

  return createViewModelFromMonitoringConditions(order)
}

export default createViewModel
