import { z } from 'zod'

const CurfewTimetableModel = z.object({})

export type CurfewTimetable = z.infer<typeof CurfewTimetableModel>

export default CurfewTimetableModel
