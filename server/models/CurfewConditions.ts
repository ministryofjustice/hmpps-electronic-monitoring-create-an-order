import { z } from 'zod'

const CurfewConditionsModel = z.object({
  id: z.string().optional(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  curfewAddress: z.string().nullable().optional(),
  curfewAdditionalDetails: z.string().nullable(),
})

export type CurfewConditions = z.infer<typeof CurfewConditionsModel>

export default CurfewConditionsModel
