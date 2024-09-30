import z from 'zod'
import DeviceWearerModel from './DeviceWearer'
import DeviceWearerContactDetailsModel from './DeviceWearerContactDetails'

export const OrderStatusEnum = z.enum(['IN_PROGRESS', 'ERROR', 'SUBMITTED'])

const OrderModel = z.object({
  id: z.string().uuid(),
  status: OrderStatusEnum,
  deviceWearer: DeviceWearerModel,
  deviceWearerContactDetails: DeviceWearerContactDetailsModel,
})

export type Order = z.infer<typeof OrderModel>
export type OrderStatus = z.infer<typeof OrderStatusEnum>

export default OrderModel
