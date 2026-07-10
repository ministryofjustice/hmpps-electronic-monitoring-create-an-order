import z from 'zod'
import { OrderStatusEnum, OrderTypeEnum } from './Order'

const OrderListInformationModel = z.object({
  id: z.string().uuid(),
  versionId: z.string().uuid().nullable().optional(),
  status: OrderStatusEnum,
  type: OrderTypeEnum,
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  notifyingOrganisation: z.string().nullable().optional(),
  lastUpdatedBy: z.string().nullable().optional(),
  lastUpdatedDateTime: z.string().datetime({ offset: true }).nullable().optional(),
})

export type OrderListInformation = z.infer<typeof OrderListInformationModel>
export default OrderListInformationModel
export const OrderListInformationList = z.array(OrderListInformationModel)
