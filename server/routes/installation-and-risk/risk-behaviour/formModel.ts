import z from 'zod'
import { validationErrors } from '../../../constants/validationErrors'

const NO_RISK = 'NO_RISK'

const RiskBehaviourFormModel = z.object({
  action: z.string(),
  possibleRisk: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform(val => {
      if (val === undefined) return []
      const risks = Array.isArray(val) ? val : [val]
      return risks.includes(NO_RISK) ? [NO_RISK] : risks
    }),
})

export const RiskBehaviourFormValidator = z.object({
  possibleRisk: z.array(z.string()).min(1, validationErrors.installationAndRisk.possibleRiskRequired),
})

export type RiskBehaviourInput = z.infer<typeof RiskBehaviourFormModel>
export default RiskBehaviourFormModel
