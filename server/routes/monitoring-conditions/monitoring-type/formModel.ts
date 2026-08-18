import { z } from 'zod'
import { MonitoringTypesEnum } from '../model'

const MonitoringTypesFormDataModel = z.object({
  action: z.string(),
  monitoringType: MonitoringTypesEnum.nullable().optional(),
})

export default MonitoringTypesFormDataModel
