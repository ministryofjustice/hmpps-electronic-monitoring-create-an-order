import { z } from 'zod'

const InstallationAndRiskModel = z.object({
  riskOfSeriousHarm: z.string().nullable(),
  riskOfSelfHarm: z.string().nullable(),
  riskCategory: z.array(z.string()).nullable(),
  riskDetails: z.string().nullable(),
  mappaLevel: z.string().nullable(),
  mappaCaseType: z.string().nullable(),
})

export type InstallationAndRisk = z.infer<typeof InstallationAndRiskModel>

export default InstallationAndRiskModel
