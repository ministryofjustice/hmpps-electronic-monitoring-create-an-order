import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/validation/errors'
import { getError } from '../../../utils/validation/errorMessages'
import { CheckRiskInput } from './formModel'

type CheckRiskViewModel = ViewModel<Omit<CheckRiskInput, 'action'>>

const construct = (order: Order, errors: ValidationResult, checkRisk: string = ''): CheckRiskViewModel => {
  return {
    checkRisk: { value: checkRisk, error: getError(errors, 'checkRisk') },
    errorSummary: createGovukErrorSummary(errors),
  }
}

export default { construct }
