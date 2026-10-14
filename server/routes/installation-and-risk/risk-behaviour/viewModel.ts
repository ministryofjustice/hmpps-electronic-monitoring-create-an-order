import { ValidationResult } from '../../../models/Validation'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'

const construct = (possibleRisk: string[], errors: ValidationResult = []) => ({
  possibleRisk: { values: possibleRisk, error: getError(errors, 'possibleRisk') },
  errorSummary: createGovukErrorSummary(errors),
})

export default { construct }
