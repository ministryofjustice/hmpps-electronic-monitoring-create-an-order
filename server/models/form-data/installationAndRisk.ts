import { z } from 'zod'
import { validationErrors } from '../../constants/validationErrors'

const InstallationAndRiskFormDataModel = z.object({
  action: z.string().default('continue'),
  offence: z.string().optional(),
  offenceAdditionalDetails: z.string().optional(),
  possibleRisk: z
    .union([z.string(), z.array(z.string()).default([])])
    .transform(val => (Array.isArray(val) ? val : [val])),
  riskCategory: z.array(z.string()).optional(),
  riskDetails: z.string(),
  mappaLevel: z.string().optional(),
  mappaCaseType: z.string().optional(),
})

const InstallationAndRiskFormDataValidator = z
  .object({
    possibleRisk: z.array(z.string()).min(1, validationErrors.installationAndRisk.possibleRiskRequired),
    offence: z.string(),
    offenceAdditionalDetails: z.string(),
    riskCategory: z.array(z.string()),
    riskDetails: z.string(),
    mappaLevel: z.string(),
    mappaCaseType: z.string(),
  })
  .transform(({ riskCategory, possibleRisk, ...formData }) => ({
    riskCategory: [...possibleRisk, ...riskCategory],
    possibleRisk: undefined,
    ...formData,
  }))

type InstallationAndRiskFormData = z.infer<typeof InstallationAndRiskFormDataModel>

export default InstallationAndRiskFormDataModel

export { InstallationAndRiskFormData, InstallationAndRiskFormDataValidator }
