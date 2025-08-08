import { z } from 'zod'

const OrderParametersModel = z.object({
  havePhoto: z.boolean().nullable(),
})

export type OrderParameters = z.infer<typeof OrderParametersModel>

export default OrderParametersModel
