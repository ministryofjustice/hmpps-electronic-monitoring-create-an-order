import { z } from 'zod'
import MonitoringConditionsModel from '../model'

export const HdcFormDataModel = z.object({
  action: z.string(),
  hdc: MonitoringConditionsModel.shape.hdc,
})

export default HdcFormDataModel
