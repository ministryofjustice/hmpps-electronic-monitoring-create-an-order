import { ValidationResult } from '../../../models/Validation'
import ReferenceData from '../../../types/i18n/reference/reference'
import { createGovukErrorSummary } from '../../../utils/validation/errors'
import exclusiveOptions from '../../../utils/exclusiveOptions'
import toCheckboxItems from '../../../utils/toCheckboxItems'
import { getError } from '../../../utils/validation/errorMessages'
import { RISK_AT_ADDRESS_EXCLUSIVE_CODES, RISK_AT_ADDRESS_HIDDEN_CODES } from '../riskCodes'

const construct = (
  riskCategory: string[],
  riskCategories: ReferenceData,
  disabled: boolean,
  errors: ValidationResult = [],
) => ({
  riskCategory: {
    values: riskCategory,
    items: exclusiveOptions(
      toCheckboxItems(riskCategories, disabled, RISK_AT_ADDRESS_HIDDEN_CODES),
      RISK_AT_ADDRESS_EXCLUSIVE_CODES,
    ),
    error: getError(errors, 'riskCategory'),
  },
  errorSummary: createGovukErrorSummary(errors),
})

export default { construct }
