import { z } from 'zod'

export const AlcoholMonitoringTypeEnum = z.enum(['ALCOHOL_LEVEL', 'ALCOHOL_ABSTINENCE']).nullable()

const AlcoholMonitoringModel = z.object({
  monitoringType: AlcoholMonitoringTypeEnum,
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
})

export type AlcoholMonitoring = z.infer<typeof AlcoholMonitoringModel>
export type AlcoholMonitoringType = z.infer<typeof AlcoholMonitoringTypeEnum>

export default AlcoholMonitoringModel
