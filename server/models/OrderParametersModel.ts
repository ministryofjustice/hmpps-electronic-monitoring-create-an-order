import { z } from 'zod'

const OrderParametersModel = z.object({
  havePhoto: z.boolean().nullable().optional(),
  haveCourtOrder: z.boolean().nullable().optional(),
  haveGrantOfBail: z.boolean().nullable().optional(),
})

export type OrderParameters = z.infer<typeof OrderParametersModel>

export default OrderParametersModel
