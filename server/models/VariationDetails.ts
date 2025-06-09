import { z } from 'zod'

const VariationTypeEnum = z.enum([
  // DDv4 Variation types
  'CURFEW_HOURS',
  'ADDRESS',
  'ENFORCEMENT_ADD',
  'ENFORCEMENT_UPDATE',
  'SUSPENSION',
  // DDv5 Variation types
  'CHANGE_TO_ADDRESS',
  'CHANGE_TO_PERSONAL_DETAILS',
  'CHANGE_TO_ADD_AN_EXCLUSION_ZONES',
  'CHANGE_TO_AN_EXISTING_EXCLUSION',
  'CHANGE_TO_CURFEW_HOURS',
  'ORDER_SUSPENSION',
  'CHANGE_TO_DEVICE_TYPE',
  'CHANGE_TO_ENFORCEABLE_CONDITION',
  'ADMIN_ERROR',
  'OTHER',
])

const VariationDetailsModel = z.object({
  variationType: VariationTypeEnum,
  variationDate: z.string().datetime(),
})

export type VariationDetails = z.infer<typeof VariationDetailsModel>

export default VariationDetailsModel
