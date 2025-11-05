import { z } from 'zod'
import { MonitoringTypesEnum } from '../model'

export type MonitoringType = z.infer<typeof MonitoringTypesEnum>

const MonitoringTypesFormDataModel = z.object({
  action: z.string(),
  monitoringType: MonitoringTypesEnum.nullable().optional(),
})

export default MonitoringTypesFormDataModel
