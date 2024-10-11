import { z } from 'zod'

const TrailMonitoringModel = z.object({
  startDate: z.string().nullable(),
  endDate: z.string().nullable().optional(),
})

export type TrailMonitoring = z.infer<typeof TrailMonitoringModel>

export default TrailMonitoringModel
