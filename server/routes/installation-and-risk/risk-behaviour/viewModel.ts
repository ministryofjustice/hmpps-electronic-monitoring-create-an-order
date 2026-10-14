import { ValidationResult } from '../../../models/Validation'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'

const construct = (possibleRisk: string[], genderRiskDetails: string = '', errors: ValidationResult = []) => ({
  possibleRisk: { values: possibleRisk, error: getError(errors, 'possibleRisk') },
  genderRiskDetails: { value: genderRiskDetails, error: getError(errors, 'genderRiskDetails') },
  errorSummary: createGovukErrorSummary(errors),
})

export default { construct }
