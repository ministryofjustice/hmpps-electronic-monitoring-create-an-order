import { z } from 'zod'

const CurfewReleaseDateFormDataModel = z.object({
  action: z.string().default('continue'),
  curfewAddress: z.string().optional(),
  curfewTimesStartHours: z.string(),
  curfewTimesStartMinutes: z.string(),
  curfewTimesEndHours: z.string(),
  curfewTimesEndMinutes: z.string(),
})

export type CurfewReleaseDateFormData = z.infer<typeof CurfewReleaseDateFormDataModel>

export default CurfewReleaseDateFormDataModel
