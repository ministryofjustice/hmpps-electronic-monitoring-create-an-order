import { z } from 'zod'

const AddressModel = z.object({
  addressLine1: z.string().nullable(),
  addressLine2: z.string().nullable(),
  addressLine3: z.string().nullable(),
  addressLine4: z.string().nullable(),
  postcode: z.string().nullable(),
})

export type Address = z.infer<typeof AddressModel>

export default AddressModel
