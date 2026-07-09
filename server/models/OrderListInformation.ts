import z from 'zod'
import { OrderStatusEnum, OrderTypeEnum } from './Order'
import DeviceWearerModel from './DeviceWearer'
import InterestedPartiesModel from './InterestedParties'

const OrderListInformationModel = z.object({
  id: z.string().uuid(),
  status: OrderStatusEnum,
  type: OrderTypeEnum,
  deviceWearer: DeviceWearerModel,
  interestedParties: InterestedPartiesModel.nullable(),
  lastUpdatedBy: z.string().nullable().optional(),
  lastUpdatedDateTime: z.string().datetime().nullable().optional(),
})

export type OrderListInformation = z.infer<typeof OrderListInformationModel>
export default OrderListInformationModel
export const OrderListInformationList = z.array(OrderListInformationModel)
