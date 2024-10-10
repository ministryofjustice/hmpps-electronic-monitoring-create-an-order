import z from 'zod'
import AddressModel from './Address'
import AttachmentModel from './Attachment'
import DeviceWearerContactDetailsModel from './ContactDetails'
import DeviceWearerModel from './DeviceWearer'
import DeviceWearerResponsibleAdultModel from './DeviceWearerResponsibleAdult'
import MonitoringConditionsModel from './MonitoringConditions'
import TrailMonitoringModel from './TrailMonitoring'

export const OrderStatusEnum = z.enum(['IN_PROGRESS', 'ERROR', 'SUBMITTED'])

const OrderModel = z.object({
  id: z.string().uuid(),
  status: OrderStatusEnum,
  deviceWearer: DeviceWearerModel,
  deviceWearerAddresses: z.array(AddressModel),
  deviceWearerResponsibleAdult: DeviceWearerResponsibleAdultModel.optional().nullable(),
  deviceWearerContactDetails: DeviceWearerContactDetailsModel,
  additionalDocuments: z.array(AttachmentModel),
  monitoringConditions: MonitoringConditionsModel,
  trailMonitoring: TrailMonitoringModel,
})

export type Order = z.infer<typeof OrderModel>
export type OrderStatus = z.infer<typeof OrderStatusEnum>

export default OrderModel
