import { z } from 'zod'
import MonitoringConditionsModel from '../model'

const PrarrFormDataModel = z.object({
  action: z.string(),
  prarr: MonitoringConditionsModel.shape.prarr,
})

export default PrarrFormDataModel
