import { ValidationResult } from '../../../models/Validation'
import { ErrorMessage, ViewModelBoolean } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { MonitoringConditions } from '../model'

export type MonitoringTypeModel = ViewModelBoolean<
  Pick<MonitoringConditions, 'curfew' | 'exclusionZone' | 'trail' | 'mandatoryAttendance' | 'alcohol'>
> & {
  error?: ErrorMessage
}

const constructModel = (data: MonitoringConditions, errors: ValidationResult): MonitoringTypeModel => {
  return {
    curfew: { value: data.curfew || false },
    exclusionZone: { value: data.curfew || false },
    trail: { value: data.curfew || false },
    mandatoryAttendance: { value: data.curfew || false },
    alcohol: { value: data.curfew || false },
    error: getError(errors, 'monitoringTypes'),
    errorSummary: createGovukErrorSummary(errors),
  }
}

export default constructModel
