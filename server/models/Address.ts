import { z } from 'zod'

export const AddressTypeEnum = z.enum(['PRIMARY', 'SECONDARY', 'TERTIARY'])

const AddressModel = z.object({
  addressType: AddressTypeEnum,
  addressLine1: z.string().nullable(),
  addressLine2: z.string().nullable(),
  addressLine3: z.string().nullable(),
  addressLine4: z.string().nullable(),
  postcode: z.string().nullable(),
})

export type Address = z.infer<typeof AddressModel>
export type AddressType = z.infer<typeof AddressTypeEnum>

export default AddressModel
