import { z } from 'zod'

const VariationDetailsModel = z.object({})

export type VariationDetails = z.infer<typeof VariationDetailsModel>

export default VariationDetailsModel
