import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { getError } from '../../../utils/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { MonitoringConditions } from '../model'

export type TypesOfMonitoringNeededModel = ViewModel<{}> & {
  addAnother: { value: string; error?: { text: string } }
  items: Item[]
}

type Item = Record<string, unknown>

const constructModel = (data: MonitoringConditions, errors: ValidationResult): TypesOfMonitoringNeededModel => {
  const model: TypesOfMonitoringNeededModel = {
    items: getItems(),
    addAnother: {
      value: '',
      error: getError(errors, 'addAnother'),
    },
    errorSummary: createGovukErrorSummary(errors),
  }

  return model
}

const getItems = (): Item[] => {
  return []
}

export default constructModel
