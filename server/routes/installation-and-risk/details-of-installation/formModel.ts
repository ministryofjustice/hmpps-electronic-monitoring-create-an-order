import z from 'zod'
import { validationErrors } from '../../../constants/validationErrors'

const DetailsOfInstallationFormModel = z.object({
  action: z.string(),
  possibleRisk: z
    .union([z.string(), z.array(z.string()).default([])])
    .transform(val => (Array.isArray(val) ? val : [val])),
  riskCategory: z
    .union([z.string(), z.array(z.string()).default([])])
    .transform(val => (Array.isArray(val) ? val : [val])),
  riskDetails: z.string().nullable().default(''),
  genderRiskDetails: z.string().nullable().default(''),
})

export const DetailsOfInstallationValidator = z
  .object({
    possibleRisk: z.array(z.string()).nonempty(validationErrors.installationAndRisk.possibleRiskRequired),
    riskCategory: z.array(z.string()),
    riskDetails: z.string().max(200, validationErrors.installationAndRisk.riskDetailsTooLong),
    genderRiskDetails: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.possibleRisk.includes('RISK_TO_GENDER')) {
      if (!data.genderRiskDetails) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: validationErrors.installationAndRisk.genderRiskDetailsRequired,
          fatal: true,
          path: ['genderRiskDetails'],
        })
      }
      if (data.genderRiskDetails && data.genderRiskDetails.length > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: validationErrors.installationAndRisk.genderRiskDetailsTooLong,
          fatal: true,
          path: ['genderRiskDetails'],
        })
      }
    }
  })
  .transform(({ riskCategory, possibleRisk, riskDetails, genderRiskDetails, ...formData }) => {
    if (typeof genderRiskDetails === 'string' && genderRiskDetails.trim()) {
      return {
        riskCategory: [...possibleRisk, ...riskCategory],
        riskDetails: `Risk to gender: ${genderRiskDetails}\nAdditional risk details: ${riskDetails}`,
        ...formData,
      }
    }

    return {
      riskCategory: [...possibleRisk, ...riskCategory],
      riskDetails,
      genderRiskDetails: '',
      ...formData,
    }
  })

export type DetailsOfInstallationInput = z.infer<typeof DetailsOfInstallationFormModel>
export default DetailsOfInstallationFormModel
