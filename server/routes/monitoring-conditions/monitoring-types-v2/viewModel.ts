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
} & {
  [K in keyof MonitoringTypes]: {
    disabled?: boolean
  }
}

const constructModel = (order: Order, errors: ValidationResult): MonitoringTypeModel => {
  return {
    curfew: { disabled: isCurfewComplete(order) },
    exclusionZone: { disabled: false },
    trail: { disabled: isTrailComplete(order) },
    mandatoryAttendance: { disabled: false },
    alcohol: { disabled: isAlcoholComplete(order) },
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

export default constructModel
