import z from 'zod'
import AttachmentModel from './Attachment'
import DeviceWearerAddressModel from './DeviceWearerAddress'
import DeviceWearerModel from './DeviceWearer'
import DeviceWearerContactDetailsModel from './ContactDetails'
import DeviceWearerResponsibleAdultModel from './DeviceWearerResponsibleAdult'

export const OrderStatusEnum = z.enum(['IN_PROGRESS', 'ERROR', 'SUBMITTED'])

const OrderModel = z.object({
  id: z.string().uuid(),
  status: OrderStatusEnum,
  deviceWearer: DeviceWearerModel,
  deviceWearerAddresses: z.array(DeviceWearerAddressModel),
  deviceWearerResponsibleAdult: DeviceWearerResponsibleAdultModel.optional().nullable(),
  deviceWearerContactDetails: DeviceWearerContactDetailsModel,
  additionalDocuments: z.array(AttachmentModel),
})

export type Order = z.infer<typeof OrderModel>
export type OrderStatus = z.infer<typeof OrderStatusEnum>

export default OrderModel
