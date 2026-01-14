import { z } from 'zod'

const OffenceModel = z.object({
  id: z.string().optional(),
  offenceType: z.string().nullable(),
  offenceDate: z.string().datetime().nullable(),
})

export type Offence = z.infer<typeof OffenceModel>

export default OffenceModel
