import { ValidationResult } from '../../../../models/Validation'
import { ViewModel } from '../../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../../utils/errors'
import { getError } from '../../../../utils/utils'
import { MonitoringConditions } from '../model'

export type HdcModel = ViewModel<Pick<MonitoringConditions, 'hdc'>>

const contructModel = (data: MonitoringConditions, errors: ValidationResult): HdcModel => {
  const model: HdcModel = {
    hdc: { value: data.hdc || '' },
    errorSummary: null,
  }

  if (errors && errors.length) {
    model.hdc!.error = getError(errors, 'hdc')
    model.errorSummary = createGovukErrorSummary(errors)
  }

  return model
}

export default contructModel
