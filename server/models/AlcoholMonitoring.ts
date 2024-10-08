import { z } from 'zod'

const AlcoholMonitoringModel = z.object({})

export type AlcoholMonitoring = z.infer<typeof AlcoholMonitoringModel>

export default AlcoholMonitoringModel
