import { ValidationResult } from '../../../models/Validation'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'

const construct = (riskCategory: string[], errors: ValidationResult = []) => ({
  riskCategory: { values: riskCategory, error: getError(errors, 'riskCategory') },
  errorSummary: createGovukErrorSummary(errors),
})

export default { construct }
