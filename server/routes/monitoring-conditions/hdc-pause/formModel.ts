import { z } from 'zod'
import MonitoringConditionsModel from '../model'

export const HdcPauseFormDataModel = z.object({
  action: z.string(),
  hdcPause: MonitoringConditionsModel.shape.hdc,
})

export default HdcPauseFormDataModel
