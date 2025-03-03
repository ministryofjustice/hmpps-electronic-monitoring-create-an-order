import z from 'zod'

const AddressFormDataModel = z.object({
  action: z.string().default('continue'),
  addressLine1: z.string(),
  addressLine2: z.string(),
  addressLine3: z.string(),
  addressLine4: z.string(),
  postcode: z.string(),
  hasAnotherAddress: z.string().default('false'),
})

export type AddressFormData = z.infer<typeof AddressFormDataModel>

export default AddressFormDataModel
