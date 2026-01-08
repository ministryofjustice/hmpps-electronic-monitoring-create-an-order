import { z } from 'zod'
import { DeviceTypeEnum } from './DeviceType'

const TrailMonitoringModel = z.object({
  id: z.string().optional(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable().optional(),
  deviceType: DeviceTypeEnum.nullable().optional(),
})

export type TrailMonitoring = z.infer<typeof TrailMonitoringModel>

export default TrailMonitoringModel
