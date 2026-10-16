import z from 'zod'
import { validationErrors } from '../../../constants/validationErrors'

const RiskAtAddressFormModel = z.object({
  action: z.string(),
  riskCategory: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform(val => {
      if (val === undefined) return []
      return Array.isArray(val) ? val : [val]
    }),
})

export const RiskAtAddressFormValidator = z.object({
  riskCategory: z.array(z.string()).min(1, validationErrors.installationAndRisk.riskCategoryRequired),
})

export default RiskAtAddressFormModel
