import { z } from 'zod'

const InstallationAndRiskModel = z.object({})

export type InstallationAndRisk = z.infer<typeof InstallationAndRiskModel>

export default InstallationAndRiskModel
