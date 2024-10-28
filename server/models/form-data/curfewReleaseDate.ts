import { z } from 'zod'

const CurfewReleaseDateFormDataModel = z.object({
  action: z.string().default('continue'),
  address: z.string().optional(),
  releaseDateDay: z.string(),
  releaseDateMonth: z.string(),
  releaseDateYear: z.string(),
  curfewTimesStartHours: z.string(),
  curfewTimesStartMinutes: z.string(),
  curfewTimesEndHours: z.string(),
  curfewTimesEndMinutes: z.string(),
})

export type CurfewReleaseDateFormData = z.infer<typeof CurfewReleaseDateFormDataModel>

export default CurfewReleaseDateFormDataModel
