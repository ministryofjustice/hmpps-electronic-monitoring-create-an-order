import { z } from 'zod'

const CurfewConditionsModel = z.object({
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  addresses: z.array(z.string()).nullable(),
})

export type CurfewConditions = z.infer<typeof CurfewConditionsModel>

export default CurfewConditionsModel
