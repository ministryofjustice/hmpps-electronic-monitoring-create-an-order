import { z } from 'zod'

const Schedule = z.object({
  dayOfWeek: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  orderId: z.string(),
  curfewAddress: z.string(),
})

const CurfewTimetableModel = z.array(Schedule)

export type CurfewTimetable = z.infer<typeof CurfewTimetableModel>
export type CurfewSchedule = z.infer<typeof Schedule>

export default CurfewTimetableModel
