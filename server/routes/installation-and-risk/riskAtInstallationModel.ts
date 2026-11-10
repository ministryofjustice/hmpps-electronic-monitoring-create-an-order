import { z } from 'zod'

const RiskAtInstallationModel = z.object({
  possibleRisk: z.array(z.string()),
  riskCategory: z.array(z.string()),
  riskDetails: z.string(),
  hasOtherRisks: z.enum(['YES', 'NO']).nullable().default(null),
  genderRiskDetails: z.string(),
  riskCheck: z.enum(['YES', 'NO']).nullable().default(null),
})

export type RiskAtInstallation = z.infer<typeof RiskAtInstallationModel>

export default RiskAtInstallationModel
