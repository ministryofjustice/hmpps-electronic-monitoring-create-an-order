import { z } from 'zod'
import MonitoringConditionsModel from '../model'

export const DapolMissedInErrorFormDataModel = z.object({
  action: z.string(),
  dapolMissedInError: MonitoringConditionsModel.shape.dapolMissedInError,
})

export default DapolMissedInErrorFormDataModel
