import { z } from 'zod'
import MonitoringConditionsModel from '../model'

export const SentenceTypeFormDataModel = z.object({
  action: z.string(),
  sentenceType: MonitoringConditionsModel.shape.sentenceType,
})

export default SentenceTypeFormDataModel
