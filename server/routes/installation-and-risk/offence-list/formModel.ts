import { z } from 'zod'

export const offenceListSummaryFormDataModel = z.object({
  action: z.string(),
  addAnother: z.string().nullable().optional(),
})

export default offenceListSummaryFormDataModel
