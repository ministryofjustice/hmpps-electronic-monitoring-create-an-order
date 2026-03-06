import { z } from 'zod'
import { validationErrors } from '../../../constants/validationErrors'

const FindAddressFormData = z.object({
  action: z.string(),
  postcode: z.string().optional(),
  id: z.string().optional(),
})

export const FindAddressValidator = z.object({
  postcode: z.string().min(1, validationErrors.postcodeLookup.postcodeRequired),
  id: z.string().optional(),
})

export type FindAddressForm = z.infer<typeof FindAddressFormData>
export type FindAddress = z.infer<typeof FindAddressValidator>
export default FindAddressFormData
