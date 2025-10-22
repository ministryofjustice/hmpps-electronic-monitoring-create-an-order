import { ValidationResult } from '../../../models/Validation'
import { ViewModelBoolean } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { MonitoringConditions } from '../model'

export type MonitoringTypeModel = ViewModelBoolean<
  Pick<MonitoringConditions, 'curfew' | 'exclusionZone' | 'trail' | 'mandatoryAttendance' | 'alcohol'>
>

const constructModel = (data: MonitoringConditions, errors: ValidationResult): MonitoringTypeModel => {
  return {
    curfew: { value: data.curfew || false },
    exclusionZone: { value: data.curfew || false },
    trail: { value: data.curfew || false },
    mandatoryAttendance: { value: data.curfew || false },
    alcohol: { value: data.curfew || false },
    errorSummary: createGovukErrorSummary(errors),
  }
}

export default constructModel
