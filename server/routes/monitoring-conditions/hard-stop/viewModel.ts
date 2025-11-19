import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { MonitoringConditions } from '../model'

export type HardStopModel = ViewModel<Pick<MonitoringConditions, 'hardStop'>>

const constructModel = (data: MonitoringConditions, errors: ValidationResult): HardStopModel => {
  return {
    hardStop: { value: '' },
    errorSummary: null,
  }
}

export default constructModel
