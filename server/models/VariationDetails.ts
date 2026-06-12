import { z } from 'zod'

const VariationDetailsModel = z.object({
  variationDate: z.string().datetime(),
  variationDetails: z.string(),
})

export type VariationDetails = z.infer<typeof VariationDetailsModel>

export default VariationDetailsModel
