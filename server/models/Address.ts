import { z } from 'zod'

export const AddressTypeEnum = z.enum([
  'PRIMARY',
  'SECONDARY',
  'TERTIARY',
  'RESPONSIBLE_ADULT',
  'INSTALLATION',
  'RESPONSIBLE_ORGANISATION',
])

const AddressModel = z.object({
  addressType: AddressTypeEnum,
  addressLine1: z.string(),
  addressLine2: z.string(),
  addressLine3: z.string(),
  addressLine4: z.string(),
  postcode: z.string(),
})

export type Address = z.infer<typeof AddressModel>
export type AddressWithoutType = Omit<Address, 'addressType'>
export type AddressType = z.infer<typeof AddressTypeEnum>

export default AddressModel
