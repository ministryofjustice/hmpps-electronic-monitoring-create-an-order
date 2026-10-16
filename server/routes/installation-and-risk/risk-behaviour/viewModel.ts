import { ValidationResult } from '../../../models/Validation'
import ReferenceData from '../../../types/i18n/reference/reference'
import { createGovukErrorSummary } from '../../../utils/errors'
import exclusiveOptions from '../../../utils/exclusiveOptions'
import toCheckboxItems from '../../../utils/toCheckboxItems'
import { getError } from '../../../utils/utils'
import { POSSIBLE_RISK_EXCLUSIVE_CODES } from '../riskCodes'

const construct = (
  possibleRisk: string[],
  genderRiskDetails: string,
  possibleRisks: ReferenceData,
  disabled: boolean,
  errors: ValidationResult = [],
) => ({
  possibleRisk: {
    values: possibleRisk,
    items: exclusiveOptions(toCheckboxItems(possibleRisks, disabled), POSSIBLE_RISK_EXCLUSIVE_CODES),
    error: getError(errors, 'possibleRisk'),
  },
  genderRiskDetails: { value: genderRiskDetails, error: getError(errors, 'genderRiskDetails') },
  errorSummary: createGovukErrorSummary(errors),
})

export default { construct }
