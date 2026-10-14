import z from 'zod'
import { validationErrors } from '../../../constants/validationErrors'

const RiskBehaviourFormModel = z.object({
  action: z.string(),
  possibleRisk: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform(val => {
      if (val === undefined) return []
      return Array.isArray(val) ? val : [val]
    }),
})

export const RiskBehaviourFormValidator = z.object({
  possibleRisk: z.array(z.string()).min(1, validationErrors.installationAndRisk.possibleRiskRequired),
})

export type RiskBehaviourInput = z.infer<typeof RiskBehaviourFormModel>
export default RiskBehaviourFormModel
