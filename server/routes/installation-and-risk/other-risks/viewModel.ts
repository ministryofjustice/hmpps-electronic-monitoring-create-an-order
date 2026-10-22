import { ValidationResult } from '../../../models/Validation'
import { createGovukErrorSummary } from '../../../utils/validation/errors'
import { getError } from '../../../utils/validation/errorMessages'

const construct = (
  hasOtherRisks: string | null | undefined,
  riskDetails: string,
  disabled: boolean,
  errors: ValidationResult = [],
) => ({
  hasOtherRisks: {
    value: hasOtherRisks ?? '',
    items: [
      { value: 'YES', text: 'Yes', disabled },
      { value: 'NO', text: 'No', disabled },
    ],
    error: getError(errors, 'hasOtherRisks'),
  },
  riskDetails: {
    value: riskDetails,
    error: getError(errors, 'riskDetails'),
  },
  errorSummary: createGovukErrorSummary(errors),
})

export default { construct }
