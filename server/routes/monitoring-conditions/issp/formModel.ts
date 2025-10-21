import { z } from 'zod'
import MonitoringConditionsModel from '../model'

export const IsspFormDataModel = z.object({
  action: z.string(),
  issp: MonitoringConditionsModel.shape.issp,
})

export default IsspFormDataModel
