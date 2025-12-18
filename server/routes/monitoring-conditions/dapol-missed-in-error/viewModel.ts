import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { MonitoringConditions } from '../model'

export type DapolMissedInErrorModel = ViewModel<Pick<MonitoringConditions, 'dapolMissedInError'>>

const constructModel = (data: MonitoringConditions, errors: ValidationResult): DapolMissedInErrorModel => {
  const model: DapolMissedInErrorModel = {
    dapolMissedInError: {
      value: data.dapolMissedInError || '',
    },
    errorSummary: null,
  }

  if (errors && errors.length > 0) {
    model.dapolMissedInError!.error = getError(errors, 'dapolMissedInError')
    model.errorSummary = createGovukErrorSummary(errors)
  }

  return model
}

export default constructModel
