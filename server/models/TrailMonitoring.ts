import { z } from 'zod'

const TrailMonitoringModel = z.object({})

export type TrailMonitoring = z.infer<typeof TrailMonitoringModel>

export default TrailMonitoringModel
