import z from 'zod'
import { validationErrors } from '../../../constants/validationErrors'
import exclusiveCheckboxValues from '../../../utils/exclusiveCheckboxValues'
import { POSSIBLE_RISK_EXCLUSIVE_CODES } from '../riskCodes'

const RISK_TO_GENDER = 'RISK_TO_GENDER'

const RiskBehaviourFormModel = z.object({
  action: z.string(),
  possibleRisk: exclusiveCheckboxValues(POSSIBLE_RISK_EXCLUSIVE_CODES),
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
