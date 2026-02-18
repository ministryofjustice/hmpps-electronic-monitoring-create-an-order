import { z } from 'zod'
import MonitoringConditionsModel from '../model'

export const PilotFormDataModel = z.object({
  action: z.string(),
  pilot: MonitoringConditionsModel.shape.pilot,
})

export default PilotFormDataModel
