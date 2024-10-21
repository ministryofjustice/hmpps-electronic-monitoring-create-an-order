import { z } from 'zod'

const CurfewTimetableModel = z.array(
  z.object({
    dayOfWeek: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    orderId: z.string(),
    curfewAddress: z.string(),
  }),
)

export type CurfewTimetable = z.infer<typeof CurfewTimetableModel>

export default CurfewTimetableModel
