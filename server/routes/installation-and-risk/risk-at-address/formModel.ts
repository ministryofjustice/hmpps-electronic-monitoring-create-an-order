import z from 'zod'
import { validationErrors } from '../../../constants/validationErrors'

const EXCLUSIVE_OPTIONS = ['NO_RISK_AT_ADDRESS', 'RISK_AT_ADDRESS_UNKNOWN']

const RiskAtAddressFormModel = z.object({
  action: z.string(),
  riskCategory: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform(val => {
      if (val === undefined) return []
      const risks = Array.isArray(val) ? val : [val]
      const exclusive = risks.find(risk => EXCLUSIVE_OPTIONS.includes(risk))
      return exclusive ? [exclusive] : risks
    }),
})

export const RiskAtAddressFormValidator = z.object({
  riskCategory: z.array(z.string()).min(1, validationErrors.installationAndRisk.riskCategoryRequired),
})

export default RiskAtAddressFormModel
