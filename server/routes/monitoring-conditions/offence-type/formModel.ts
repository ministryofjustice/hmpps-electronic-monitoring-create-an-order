import { z } from 'zod'
import MonitoringConditionsModel from '../model'

const OffenceTypeFormDataModel = z.object({
  action: z.string(),
  offenceType: MonitoringConditionsModel.shape.offenceType,
})

export default OffenceTypeFormDataModel
