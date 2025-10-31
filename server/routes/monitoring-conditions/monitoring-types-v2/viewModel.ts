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

export type MonitoringTypeModel = {
  errorSummary: ErrorSummary | null
  error?: ErrorMessage
  message?: string
} & {
  [K in keyof MonitoringTypes]: {
    disabled?: boolean
  }
}

const constructModel = (order: Order, errors: ValidationResult): MonitoringTypeModel => {
  const enabled = getEnabled(order)
  const isDisabled = (monitoringType: keyof MonitoringTypes): boolean => {
    return !enabled.options.includes(monitoringType)
  }

  return {
    curfew: { disabled: isCurfewComplete(order) || isDisabled('curfew') },
    exclusionZone: { disabled: isDisabled('exclusionZone') },
    trail: { disabled: isTrailComplete(order) || isDisabled('trail') },
    mandatoryAttendance: { disabled: isDisabled('mandatoryAttendance') },
    alcohol: { disabled: isAlcoholComplete(order) || isDisabled('alcohol') },
    message: enabled.message,
    error: getError(errors, 'monitoringType'),
    errorSummary: createGovukErrorSummary(errors),
  }
}

const isCurfewComplete = (order: Order) => {
  return (
    order.monitoringConditions.curfew === true &&
    isNotNullOrUndefined(order.curfewConditions) &&
    isNotNullOrUndefined(order.curfewReleaseDateConditions) &&
    isNotNullOrUndefined(order.curfewTimeTable)
  )
}

const isTrailComplete = (order: Order) => {
  return order.monitoringConditions.trail === true && isNotNullOrUndefined(order.monitoringConditionsTrail)
}

const isAlcoholComplete = (order: Order) => {
  return order.monitoringConditions.alcohol === true && isNotNullOrUndefined(order.monitoringConditionsAlcohol)
}

const getEnabled = (order: Order): { options: (keyof MonitoringTypes)[]; message?: string } => {
  if (order.monitoringConditions.hdc === 'NO') {
    if (order.monitoringConditions.pilot === 'UNKNOWN') {
      return {
        options: ['alcohol'],
        message: "Some monitoring types can't be selected because the device wearer is not part of any pilots.",
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
