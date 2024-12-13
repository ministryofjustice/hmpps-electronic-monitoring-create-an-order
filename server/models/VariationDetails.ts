import { z } from 'zod'

const VariationTypeEnum = z.enum(['CURFEW_HOURS', 'ADDRESS', 'ENFORCEMENT_ADD', 'ENFORCEMENT_UPDATE', 'SUSPENSION'])

const VariationDetailsModel = z.object({
  variationType: VariationTypeEnum,
  variationDate: z.string().datetime(),
})

export type VariationDetails = z.infer<typeof VariationDetailsModel>

export default VariationDetailsModel
