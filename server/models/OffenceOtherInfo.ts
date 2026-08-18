import { z } from 'zod'

const OffenceOtherInfoModel = z.object({
  id: z.string().optional(),
  additionalDetails: z.string().nullable().optional(),
})

export default OffenceOtherInfoModel
