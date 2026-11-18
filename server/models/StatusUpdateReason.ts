import z from 'zod'

const StatusUpdateReasonModel = z.object({
  section: z.string(),
  details: z.string().nullable().optional(),
})

export type StatusUpdateReason = z.infer<typeof StatusUpdateReasonModel>
export default StatusUpdateReasonModel
