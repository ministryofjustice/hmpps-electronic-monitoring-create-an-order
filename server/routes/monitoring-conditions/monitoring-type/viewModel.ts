import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { ErrorMessage } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { ErrorSummary } from '../../../utils/govukFrontEndTypes/errorSummary'
import { getError, isNotNullOrUndefined } from '../../../utils/utils'
import { MonitoringConditions } from '../model'
import { getMonitoringEligibilityService } from './monitoringTypeEligibilityService'

type MonitoringTypes = Pick<
  MonitoringConditions,
  'curfew' | 'exclusionZone' | 'trail' | 'mandatoryAttendance' | 'alcohol' | 'restrictionZone'
>
const MonitoringTypesKeys: (keyof MonitoringTypes)[] = [
  'curfew',
  'exclusionZone',
  'trail',
  'mandatoryAttendance',
  'alcohol',
  'restrictionZone',
]
export type MonitoringTypeModel = {
  errorSummary: ErrorSummary | null
  error?: ErrorMessage
  message?: string
  exception?: boolean
  allconditionsDisabled?: boolean
} & {
  [K in keyof MonitoringTypes]: {
    disabled?: boolean
  }
}

const constructModel = (order: Order, errors: ValidationResult): MonitoringTypeModel => {
  const enabled = getMonitoringEligibilityService(order.isSentencingAct === true).getEnabled(order)

  const model: MonitoringTypeModel = {
    message: enabled.message,
    exception: enabled.exception,
    error: getError(errors, 'monitoringType'),
    errorSummary: createGovukErrorSummary(errors),
  }

  MonitoringTypesKeys.forEach(condition => {
    model[condition] = { disabled: isConditionDisabled(order, condition) || !enabled.options.includes(condition) }
  })

  if (MonitoringTypesKeys.every(condition => model[condition]?.disabled)) {
    if (model.exception !== true) {
      model.message = 'There are no additional eligible monitoring types available to add'
    }
    model.allconditionsDisabled = true
  }

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

export default constructModel
