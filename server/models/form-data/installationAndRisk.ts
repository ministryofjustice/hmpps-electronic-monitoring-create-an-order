import { z } from 'zod'

const InstallationAndRiskFormDataModel = z.object({
  action: z.string().default('continue'),
  offence: z.string().optional(),
  riskCategory: z.array(z.string()).optional(),
  riskDetails: z.string(),
  mappaLevel: z.string().optional(),
  mappaCaseType: z.string().optional(),
})

type InstallationAndRiskFormData = z.infer<typeof InstallationAndRiskFormDataModel>

export default InstallationAndRiskFormDataModel

export { InstallationAndRiskFormData }
