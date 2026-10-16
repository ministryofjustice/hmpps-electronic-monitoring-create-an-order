import z from 'zod'
import { validationErrors } from '../../../constants/validationErrors'
import exclusiveCheckboxValues from '../../../utils/exclusiveCheckboxValues'

const EXCLUSIVE_OPTIONS = ['NO_RISK_AT_ADDRESS', 'RISK_AT_ADDRESS_UNKNOWN']

const RiskAtAddressFormModel = z.object({
  action: z.string(),
  riskCategory: exclusiveCheckboxValues(EXCLUSIVE_OPTIONS),
})

export const RiskAtAddressFormValidator = z.object({
  riskCategory: z.array(z.string()).min(1, validationErrors.installationAndRisk.riskCategoryRequired),
})

export default RiskAtAddressFormModel
