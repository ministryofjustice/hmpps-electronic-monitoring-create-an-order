import z from 'zod'
import { validationErrors } from '../../../constants/validationErrors'

export const OTHER_RISKS_DETAILS_MAX_LENGTH = 200

const OtherRisksFormModel = z.object({
  action: z.string(),
  hasOtherRisks: z.string().optional(),
  riskDetails: z.string().default(''),
})

export const OtherRisksFormValidator = z
  .object({
    hasOtherRisks: z.enum(['YES', 'NO'], { message: validationErrors.installationAndRisk.hasOtherRisksRequired }),
    riskDetails: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.hasOtherRisks !== 'YES') return

    if (!data.riskDetails) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: validationErrors.installationAndRisk.riskDetailsRequired,
        path: ['riskDetails'],
      })
    } else if (data.riskDetails.length > OTHER_RISKS_DETAILS_MAX_LENGTH) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: validationErrors.installationAndRisk.riskDetailsTooLong,
        path: ['riskDetails'],
      })
    }
  })

export default OtherRisksFormModel
