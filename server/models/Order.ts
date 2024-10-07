import z from 'zod'
import DeviceWearerModel from './DeviceWearer'
import DeviceWearerContactDetailsModel from './ContactDetails'
import AttachmentModel from './Attachment'

export const OrderStatusEnum = z.enum(['IN_PROGRESS', 'ERROR', 'SUBMITTED'])

const OrderModel = z.object({
  id: z.string().uuid(),
  status: OrderStatusEnum,
  deviceWearer: DeviceWearerModel,
  deviceWearerContactDetails: DeviceWearerContactDetailsModel,
  additionalDocuments: z.array(AttachmentModel),
})

export type Order = z.infer<typeof OrderModel>
export type OrderStatus = z.infer<typeof OrderStatusEnum>

export default OrderModel
