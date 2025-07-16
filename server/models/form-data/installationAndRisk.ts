import { z } from 'zod'
import { validationErrors } from '../../constants/validationErrors'

const InstallationAndRiskFormDataModel = z.object({
  action: z.string().default('continue'),
  offence: z.string().nullable().default(null),
  offenceAdditionalDetails: z.string().default(''),
  possibleRisk: z
    .union([z.string(), z.array(z.string()).default([])])
    .transform(val => (Array.isArray(val) ? val : [val])),
  riskCategory: z
    .union([z.string(), z.array(z.string()).default([])])
    .transform(val => (Array.isArray(val) ? val : [val])),
  riskDetails: z.string().nullable().default(null),
  mappaLevel: z.string().nullable().default(null),
  mappaCaseType: z.string().nullable().default(null),
})

const InstallationAndRiskFormDataValidator = z
  .object({
    possibleRisk: z.array(z.string()),
    offence: z.string().nullable(),
    offenceAdditionalDetails: z.string(),
    riskCategory: z.array(z.string()),
    riskDetails: z
      .string()
      .min(1, validationErrors.installationAndRisk.riskDetailsRequired)
      .max(200, validationErrors.installationAndRisk.riskDetailsTooLong),
    mappaLevel: z.string().nullable(),
    mappaCaseType: z.string().nullable(),
  })
  .transform(({ riskCategory, possibleRisk, ...formData }) => ({
    riskCategory: [...possibleRisk, ...riskCategory],
    possibleRisk: undefined,
    ...formData,
  }))

type InstallationAndRiskFormData = z.infer<typeof InstallationAndRiskFormDataModel>

export default InstallationAndRiskFormDataModel

export { InstallationAndRiskFormData, InstallationAndRiskFormDataValidator }
