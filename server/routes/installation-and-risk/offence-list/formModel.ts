import { z } from 'zod'

const offenceListSummaryFormDataModel = z.object({
  action: z.string(),
  addAnother: z.string().nullable().optional(),
})

export default offenceListSummaryFormDataModel
