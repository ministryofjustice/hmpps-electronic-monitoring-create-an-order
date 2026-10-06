import z from 'zod'

const StatusUpdateReasonModel = z.object({
  id: z.string().uuid(),
  statusUpdateId: z.string().uuid(),
  section: z.string(),
  details: z.string().nullable(),
})

export type StatusUpdateReason = z.infer<typeof StatusUpdateReasonModel>
export default StatusUpdateReasonModel
