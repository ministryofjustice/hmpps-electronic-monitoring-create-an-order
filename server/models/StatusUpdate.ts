import z from 'zod'
import StatusUpdateReasonModel from './StatusUpdateReason'

export const StatusUpdateStatusEnum = z.enum(['REJECTED'])

const StatusUpdateModel = z.object({
  id: z.string().uuid(),
  versionId: z.string().uuid(),
  status: StatusUpdateStatusEnum,
  datetimeOfStatusChange: z.string().datetime(),
  statusUpdateReasons: z.array(StatusUpdateReasonModel),
})

export type StatusUpdate = z.infer<typeof StatusUpdateModel>
export default StatusUpdateModel
