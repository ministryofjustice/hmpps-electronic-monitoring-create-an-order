import { z } from 'zod'
import { validationErrors } from '../../../constants/validationErrors'

const NewDocumentFormModel = z.object({
  action: z.string(),
  fileRequired: z.string().nullable().default(''),
})

export const NewDocumentFormValidator = z.object({
  fileRequired: z.enum(['yes', 'no'], { message: validationErrors.attachments.newDocumentRequired }),
})

export type NewDocumentFormData = z.infer<typeof NewDocumentFormModel>
export default NewDocumentFormModel
