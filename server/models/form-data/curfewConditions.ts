import { z } from 'zod'

const CurfewConditionsFormDataModel = z.object({
  action: z.string().default('continue'),
  addresses: z.string().or(z.array(z.string())).optional(),
  'startDate-day': z.string(),
  'startDate-month': z.string(),
  'startDate-year': z.string(),
  'endDate-day': z.string(),
  'endDate-month': z.string(),
  'endDate-year': z.string(),
})

export type CurfewConditionsFormData = z.infer<typeof CurfewConditionsFormDataModel>

export default CurfewConditionsFormDataModel
