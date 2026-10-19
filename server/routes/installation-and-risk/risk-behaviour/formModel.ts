import z from 'zod'
import { validationErrors } from '../../../constants/validationErrors'
import exclusiveCheckboxValues from '../../../utils/exclusiveCheckboxValues'
import { POSSIBLE_RISK_EXCLUSIVE_CODES, RISK_TO_GENDER } from '../riskCodes'

const RiskBehaviourFormModel = z.object({
  action: z.string(),
  possibleRisk: exclusiveCheckboxValues(POSSIBLE_RISK_EXCLUSIVE_CODES),
  genderRiskDetails: z.string().default(''),
})

export const RiskBehaviourFormValidator = z
  .object({
    possibleRisk: z.array(z.string()).min(1, validationErrors.installationAndRisk.possibleRiskRequired),
    genderRiskDetails: z.string().default(''),
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

export type RiskBehaviourFormInput = z.infer<typeof RiskBehaviourFormModel>
export default RiskBehaviourFormModel
