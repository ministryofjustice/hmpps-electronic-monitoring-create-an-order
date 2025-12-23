import { z } from 'zod'

const OrderParametersModel = z.object({
  havePhoto: z.boolean().nullable(),
  haveCourtOrder: z.boolean().nullable().optional(),
})

export type OrderParameters = z.infer<typeof OrderParametersModel>

export default OrderParametersModel
