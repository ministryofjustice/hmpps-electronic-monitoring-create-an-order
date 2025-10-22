import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { ViewModelBoolean } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { MonitoringConditions } from '../model'

export type MonitoringTypeModel = ViewModelBoolean<
  Pick<MonitoringConditions, 'curfew' | 'exclusionZone' | 'trail' | 'mandatoryAttendance' | 'alcohol'>
>

const constructModel = (order: Order, errors: ValidationResult): MonitoringTypeModel => {
  return {
    curfew: { value: order.monitoringConditions.curfew || false },
    exclusionZone: { value: order.monitoringConditions.curfew || false },
    trail: { value: order.monitoringConditions.curfew || false },
    mandatoryAttendance: { value: order.monitoringConditions.curfew || false },
    alcohol: { value: order.monitoringConditions.curfew || false },
    errorSummary: createGovukErrorSummary(errors),
  }
}

export default constructModel
