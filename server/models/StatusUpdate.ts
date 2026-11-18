import z from 'zod'
import StatusUpdateReasonModel from './StatusUpdateReason'
import { OrderTypeEnum } from './Order'

export const StatusUpdateStatusEnum = z.enum([
  'REJECTED',
  'ACCEPTED',
  'SUBMITTED',
  'SUBMISSION_FAILED',
  'CREATED',
  'VERSION_CREATED',
])

const StatusUpdateModel = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  orderVersionId: z.string().uuid(),
  orderVersionType: OrderTypeEnum,
  status: StatusUpdateStatusEnum,
  datetimeOfStatusChange: z.string().datetime({ offset: true }),
  statusUpdatedBy: z.string().nullable().optional(),
  reasons: z.array(StatusUpdateReasonModel),
})

export const StatusUpdateListModel = z.array(StatusUpdateModel)

export type StatusUpdate = z.infer<typeof StatusUpdateModel>
export default StatusUpdateModel
