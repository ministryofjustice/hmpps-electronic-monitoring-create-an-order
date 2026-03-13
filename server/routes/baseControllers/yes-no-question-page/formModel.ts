import { z } from 'zod'

export const YesNoQuestionFormDataModel = z.object({
  action: z.string(),
  answer: z.string().optional(),
})

export type YesNoQuestionFormData = Omit<z.infer<typeof YesNoQuestionFormDataModel>, 'action'>
