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
})

export const DetailsOfInstallationValidator = z
  .object({
    possibleRisk: z.array(z.string()).nonempty(validationErrors.installationAndRisk.possibleRiskRequired),
    riskCategory: z.array(z.string()),
    riskDetails: z.string().max(200, validationErrors.installationAndRisk.riskDetailsTooLong),
  })
  .transform(({ riskCategory, possibleRisk, ...formData }) => ({
    riskCategory: [...possibleRisk, ...riskCategory],
    ...formData,
  }))

export type DetailsOfInstallationInput = z.infer<typeof DetailsOfInstallationFormModel>
export default DetailsOfInstallationFormModel
