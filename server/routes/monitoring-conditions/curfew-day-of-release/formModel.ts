import { z } from 'zod'

export const CurfewDayOfReleaseFormDataModel = z.object({
  action: z.string(),
  standardCurfewTimes: z.enum(['YES', 'NO']).nullable().optional(),
})

export type CurfewDayOfReleaseFormData = z.infer<typeof CurfewDayOfReleaseFormDataModel>

export default CurfewDayOfReleaseFormDataModel
