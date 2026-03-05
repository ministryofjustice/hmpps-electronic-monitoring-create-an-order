import { z } from 'zod'

const FindAddressFormData = z.object({
  action: z.string(),
  postcode: z.string().optional(),
  id: z.string().optional(),
})

export const FindAddressValidator = z.object({
  postcode: z.string().min(1, 'Enter the postcode'),
  id: z.string().optional(),
})

export type FindAddressData = z.infer<typeof FindAddressFormData>
export default FindAddressFormData
