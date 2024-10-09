import { z } from 'zod'

export const AddressType = z.enum(['PRIMARY', 'SECONDARY', 'TERTIARY'])

const AddressModel = z.object({
  addressType: AddressType,
  addressLine1: z.string(),
  addressLine2: z.string(),
  addressLine3: z.string(),
  addressLine4: z.string(),
  postCode: z.string(),
})

export type Address = z.infer<typeof AddressModel>
export type AddressType = z.infer<typeof AddressType>

export default AddressModel
