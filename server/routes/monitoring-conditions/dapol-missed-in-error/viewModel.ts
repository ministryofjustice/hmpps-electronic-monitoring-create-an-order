import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/validation/errors'
import { MonitoringConditions } from '../model'
import { getError } from '../../../utils/validation/errorMessages'

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
