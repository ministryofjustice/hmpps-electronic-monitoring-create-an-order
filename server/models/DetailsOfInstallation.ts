import { z } from 'zod'

const DetailsOfInstallationModel = z.object({
  riskCategory: z.array(z.string()).nullable(),
  genderRiskDetails: z.string().nullable().optional(),
  riskDetails: z.string().nullable(),
})

export type DetailsOfInstallation = z.infer<typeof DetailsOfInstallationModel>

export default DetailsOfInstallationModel
