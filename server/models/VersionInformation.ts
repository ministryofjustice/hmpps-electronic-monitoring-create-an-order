import z from 'zod'
import { OrderStatusEnum, OrderTypeEnum } from './Order'

const VersionInformationModel = z.object({
  orderId: z.string().uuid(),
  status: OrderStatusEnum,
  type: OrderTypeEnum,
  fmsResultDate: z.string().datetime().nullable().optional(),
  submittedBy: z.string().nullable().optional(),
  versionId: z.string().uuid(),
  versionNumber: z.number(),
})

export type VersionInformation = z.infer<typeof VersionInformationModel>
export default VersionInformationModel
export const VersionInformationList = z.array(VersionInformationModel)
