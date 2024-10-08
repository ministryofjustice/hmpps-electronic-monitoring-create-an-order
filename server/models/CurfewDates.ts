import { z } from 'zod'

const CurfewDatesModel = z.object({})

export type CurfewDates = z.infer<typeof CurfewDatesModel>

export default CurfewDatesModel
