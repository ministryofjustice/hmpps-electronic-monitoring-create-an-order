import { z } from 'zod'

export const CurfewTimetableQuestionFormDataModel = z.object({
  action: z.string(),
  standardCurfewTimes: z.enum(['YES', 'NO']).nullable().optional(),
})

export type CurfewTimetableQuestionFormData = z.infer<typeof CurfewTimetableQuestionFormDataModel>

export default CurfewTimetableQuestionFormDataModel
