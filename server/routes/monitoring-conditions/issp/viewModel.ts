import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { MonitoringConditions } from '../model'

export type IsspModel = ViewModel<Pick<MonitoringConditions, 'issp'>>

const contructModel = (data: MonitoringConditions, errors: ValidationResult): IsspModel => {
  const model: IsspModel = {
    issp: { value: data.issp || '' },
    errorSummary: null,
  }

  if (errors && errors.length) {
    model.issp!.error = getError(errors, 'issp')
    model.errorSummary = createGovukErrorSummary(errors)
  }

  return model
}

export default contructModel
