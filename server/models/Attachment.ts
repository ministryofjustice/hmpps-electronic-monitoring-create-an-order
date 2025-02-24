import z from 'zod'
import AttachmentType from './AttachmentType'

const AttachmentModel = z.object({
  id: z.string().uuid(),
  fileType: z.nativeEnum(AttachmentType),
  fileName: z.string(),
})

export type Attachment = z.infer<typeof AttachmentModel>

export default AttachmentModel
