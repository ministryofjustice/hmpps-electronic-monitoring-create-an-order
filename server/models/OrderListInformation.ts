import z from 'zod'
import { OrderStatusEnum, OrderTypeEnum } from './Order'
import { NotifyingOrganisationEnum } from './NotifyingOrganisation'

const OrderListInformationModel = z.object({
  id: z.string().uuid(),
  versionId: z.string().uuid(),
  status: OrderStatusEnum,
  type: OrderTypeEnum,
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  notifyingOrganisation: NotifyingOrganisationEnum.nullable().optional(),
})

export type OrderListInformation = z.infer<typeof OrderListInformationModel>
export default OrderListInformationModel
export const OrderListInformationList = z.array(OrderListInformationModel)
