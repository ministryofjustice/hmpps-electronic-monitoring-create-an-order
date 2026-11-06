import { ValidationResult } from '../../../models/Validation'
import { getError } from '../../../utils/validation/errorMessages'
import { createGovukErrorSummary } from '../../../utils/validation/errors'

// The question asks whether a responsible adult is required, which is the inverse of adultAtTimeOfInstallation
const construct = (adultAtTimeOfInstallation: string, disabled: boolean, errors: ValidationResult = []) => ({
  adultAtTimeOfInstallation: {
    value: adultAtTimeOfInstallation,
    items: [
      { value: 'false', text: 'Yes', disabled },
      { value: 'true', text: 'No', disabled },
    ],
    error: getError(errors, 'adultAtTimeOfInstallation'),
  },
  errorSummary: createGovukErrorSummary(errors),
})

export default { construct }
