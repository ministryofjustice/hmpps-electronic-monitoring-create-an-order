import { z } from 'zod'

const AddressModel = z.object({
  addressLine1: z.string(),
  addressLine2: z.string(),
  addressLine3: z.string(),
  addressLine4: z.string(),
  postcode: z.string(),
})

export type Address = z.infer<typeof AddressModel>

export default AddressModel
