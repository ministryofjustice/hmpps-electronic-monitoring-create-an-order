import { z } from 'zod'
import { validationErrors } from '../../constants/validationErrors'

export const FileRequiredFormDataModel = z.object({
  action: z.string(),
  fileRequired: z.string().nullable().default(''),
  fileType: z.string().optional().default(''),
})

const FileRequiredFormDataValidator = z
  .object({
    fileRequired: z.string().min(1, validationErrors.attachments.haveFileRequired),
    fileType: z.string().optional().default(''),
  })
  .transform(({ fileRequired, fileType }) => ({
    fileRequired: fileRequired === 'yes',
    fileType,
  }))

export type FileRequiredFormData = Omit<z.infer<typeof FileRequiredFormDataModel>, 'action'>
export { FileRequiredFormDataValidator }
