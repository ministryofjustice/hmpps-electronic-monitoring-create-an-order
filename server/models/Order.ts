import z from 'zod'

const OrderModel = z.object({
  id: z.string().uuid(),
  username: z.string(),
  status: z.enum(['IN_PROGRESS', 'ERROR', 'SUBMITTED']),
})

export type Order = z.infer<typeof OrderModel>

export default OrderModel
