import { z } from 'zod'
import MonitoringConditionsModel from '../model'

export const PoliceAreaFormDataModel = z.object({
  action: z.string(),
  policeArea: MonitoringConditionsModel.shape.policeArea,
})

export default PoliceAreaFormDataModel
