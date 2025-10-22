import { ValidationResult } from '../../../models/Validation'
import { ErrorMessage } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { ErrorSummary } from '../../../utils/govukFrontEndTypes/errorSummary'
import { getError } from '../../../utils/utils'
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
    value: boolean
    disabled?: boolean
  }
}

const constructModel = (data: MonitoringConditions, errors: ValidationResult): MonitoringTypeModel => {
  const enabled = getEnabled(data)
  const isDisabled = (monitoringType: keyof MonitoringTypes): boolean => {
    return !enabled.options.includes(monitoringType)
  }

  return {
    curfew: { value: data.curfew || false, disabled: isDisabled('curfew') },
    exclusionZone: { value: data.curfew || false, disabled: isDisabled('exclusionZone') },
    trail: { value: data.curfew || false, disabled: isDisabled('trail') },
    mandatoryAttendance: { value: data.curfew || false, disabled: isDisabled('mandatoryAttendance') },
    alcohol: { value: data.curfew || false, disabled: isDisabled('alcohol') },
    message: enabled.message,
    error: getError(errors, 'monitoringTypes'),
    errorSummary: createGovukErrorSummary(errors),
  }
}

const getEnabled = (data: MonitoringConditions): { options: (keyof MonitoringTypes)[]; message?: string } => {
  if (data.hdc === 'NO') {
    if (data.pilot === 'UNKNOWN') {
      return {
        options: ['alcohol'],
        message: "Some monitoring types can't be selected because the device wearer is not part of any pilots.",
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

  return { options: ['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance', 'alcohol'] }
}

export default constructModel
