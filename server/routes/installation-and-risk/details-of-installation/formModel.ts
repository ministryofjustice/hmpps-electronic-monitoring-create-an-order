import z from 'zod'

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

export type DetailsOfInstallationInput = z.infer<typeof DetailsOfInstallationFormModel>
export default DetailsOfInstallationFormModel
