import { z } from 'zod'

const CurfewTimetableModel = z.array(
  z.object({
    day: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    addresses: z.array(z.string()),
  }),
)

export type CurfewTimetable = z.infer<typeof CurfewTimetableModel>

export default CurfewTimetableModel
