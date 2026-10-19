import z from 'zod'
import { validationErrors } from '../../../constants/validationErrors'

const NO_RISK = 'NO_RISK'
const RISK_TO_GENDER = 'RISK_TO_GENDER'

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
  genderRiskDetails: z.string().default(''),
})

export const RiskBehaviourFormValidator = z
  .object({
    possibleRisk: z.array(z.string()).min(1, validationErrors.installationAndRisk.possibleRiskRequired),
    genderRiskDetails: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.possibleRisk.includes(RISK_TO_GENDER)) return

    if (!data.genderRiskDetails) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: validationErrors.installationAndRisk.genderRiskDetailsRequired,
        path: ['genderRiskDetails'],
      })
    } else if (data.genderRiskDetails.length > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: validationErrors.installationAndRisk.genderRiskDetailsTooLong,
        path: ['genderRiskDetails'],
      })
    }
  })

export default RiskBehaviourFormModel
