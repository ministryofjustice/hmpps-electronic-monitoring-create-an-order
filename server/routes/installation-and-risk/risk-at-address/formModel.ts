import z from 'zod'
import { validationErrors } from '../../../constants/validationErrors'
import exclusiveCheckboxValues from '../../../utils/exclusiveCheckboxValues'
import { RISK_AT_ADDRESS_EXCLUSIVE_CODES } from '../riskCodes'

const RiskAtAddressFormModel = z.object({
  action: z.string(),
  riskCategory: exclusiveCheckboxValues(RISK_AT_ADDRESS_EXCLUSIVE_CODES),
})

export const RiskAtAddressFormValidator = z.object({
  riskCategory: z.array(z.string()).min(1, validationErrors.installationAndRisk.riskCategoryRequired),
})

export default RiskAtAddressFormModel
