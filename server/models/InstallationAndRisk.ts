import { z } from 'zod'

const InstallationAndRiskModel = z.object({
  offence: z.string().nullable(),
  riskCategory: z.array(z.string()).nullable(),
  riskDetails: z.string().nullable(),
  // Commented as part of https://dsdmoj.atlassian.net/browse/ELM-3422
  // mappaLevel: z.string().nullable(),
  // mappaCaseType: z.string().nullable(),
})

export type InstallationAndRisk = z.infer<typeof InstallationAndRiskModel>

export default InstallationAndRiskModel
