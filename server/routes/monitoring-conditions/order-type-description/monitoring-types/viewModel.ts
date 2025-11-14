import config from '../../../../config'
import { Order } from '../../../../models/Order'
import { ValidationResult } from '../../../../models/Validation'
import { ErrorMessage } from '../../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../../utils/errors'
import { ErrorSummary } from '../../../../utils/govukFrontEndTypes/errorSummary'
import { getError } from '../../../../utils/utils'
import { MonitoringConditions } from '../model'

type MonitoringTypes = Pick<
  MonitoringConditions,
  'curfew' | 'exclusionZone' | 'trail' | 'mandatoryAttendance' | 'alcohol'
>

export type MonitoringTypeModel = {
  errorSummary: ErrorSummary | null
  error?: ErrorMessage
  message?: string
  monitoringConditionTimes?: boolean
} & {
  [K in keyof MonitoringTypes]: {
    value: boolean
    disabled?: boolean
  }
}

const constructModel = (data: MonitoringConditions, errors: ValidationResult, order: Order): MonitoringTypeModel => {
  const enabled = getEnabled(data, order)
  const isDisabled = (monitoringType: keyof MonitoringTypes): boolean => {
    return !enabled.options.includes(monitoringType)
  }

  return {
    curfew: { value: data.curfew || false, disabled: isDisabled('curfew') },
    exclusionZone: { value: data.exclusionZone || false, disabled: isDisabled('exclusionZone') },
    trail: { value: data.trail || false, disabled: isDisabled('trail') },
    mandatoryAttendance: { value: data.mandatoryAttendance || false, disabled: isDisabled('mandatoryAttendance') },
    alcohol: { value: data.alcohol || false, disabled: isDisabled('alcohol') },
    message: enabled.message,
    error: getError(errors, 'monitoringTypes'),
    errorSummary: createGovukErrorSummary(errors),
    monitoringConditionTimes: config.monitoringConditionTimes.enabled,
  }
}

const getEnabled = (
  data: MonitoringConditions,
  order: Order,
): { options: (keyof MonitoringTypes)[]; message?: string } => {
  if (data.hdc === 'NO') {
    if (data.pilot === 'UNKNOWN') {
      return {
        options: ['alcohol'],
        message:
          'Some monitoring types can’t be selected because the device wearer is not on a Home Detention Curfew (HDC) or part of any pilots.',
      }
    }
    if (data.pilot === 'GPS_ACQUISITIVE_CRIME_PAROLE') {
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
