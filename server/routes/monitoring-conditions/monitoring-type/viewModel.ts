import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { ErrorMessage } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { ErrorSummary } from '../../../utils/govukFrontEndTypes/errorSummary'
import { getError, isNotNullOrUndefined } from '../../../utils/utils'
import { MonitoringConditions } from '../model'

type MonitoringTypes = Pick<
  MonitoringConditions,
  'curfew' | 'exclusionZone' | 'trail' | 'mandatoryAttendance' | 'alcohol'
>
const MonitoringTypesKeys: (keyof MonitoringTypes)[] = [
  'curfew',
  'exclusionZone',
  'trail',
  'mandatoryAttendance',
  'alcohol',
]
export type MonitoringTypeModel = {
  errorSummary: ErrorSummary | null
  error?: ErrorMessage
  message?: string
  allconditionsDisabled?: boolean
} & {
  [K in keyof MonitoringTypes]: {
    disabled?: boolean
  }
}

const constructModel = (order: Order, errors: ValidationResult): MonitoringTypeModel => {
  const enabled = getEnabled(order)

  const model: MonitoringTypeModel = {
    message: enabled.message,
    error: getError(errors, 'monitoringType'),
    errorSummary: createGovukErrorSummary(errors),
  }

  MonitoringTypesKeys.forEach(it => {
    model[it] = { disabled: isConditionDisabled(order, it) || !enabled.options.includes(it) }
  })

  model.allconditionsDisabled = MonitoringTypesKeys.some(it => model[it]?.disabled)
  return model
}

const isConditionDisabled = (order: Order, condition: keyof MonitoringTypes) => {
  switch (condition) {
    case 'alcohol':
      return isNotNullOrUndefined(order.monitoringConditionsAlcohol)
    case 'curfew':
      return (
        isNotNullOrUndefined(order.curfewConditions) &&
        isNotNullOrUndefined(order.curfewReleaseDateConditions) &&
        isNotNullOrUndefined(order.curfewTimeTable)
      )
    case 'trail':
      return isNotNullOrUndefined(order.monitoringConditionsTrail)
    default:
      return false
  }
}

const getEnabled = (order: Order): { options: (keyof MonitoringTypes)[]; message?: string } => {
  if (order.monitoringConditions.hdc === 'NO') {
    if (order.monitoringConditions.pilot === 'UNKNOWN') {
      return {
        options: ['alcohol'],
        message:
          "Some monitoring types can't be selected because the device wearer is not on a Home Detention Curfew (HDC) or part of any pilots.",
      }
    }
    if (order.monitoringConditions.pilot === 'GPS_ACQUISITIVE_CRIME_PAROLE') {
      return {
        options: ['trail'],
        message:
          "Some monitoring types can't be selected because the device wearer is not on a Home Detention Curfew (HDC).",
      }
    }
  }

  if (!hasFixedAddress(order)) {
    return {
      options: ['alcohol'],
      message: "Some monitoring types can't be selected because the device wearer has no fixed address.",
    }
  }

  if (isYouth(order)) {
    return {
      options: ['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance'],
      message:
        'Alcohol monitoring is not an option because the device wearer is not 18 years old or older when the electonic monitoring device is installed.',
    }
  }

  return { options: ['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance', 'alcohol'] }
}

const hasFixedAddress = (order: Order): boolean => {
  const primaryAddress = order.addresses.find(({ addressType }) => addressType === 'PRIMARY')
  return primaryAddress !== undefined
}

const isYouth = (order: Order): boolean => {
  return !order.deviceWearer.adultAtTimeOfInstallation
}

export default constructModel
