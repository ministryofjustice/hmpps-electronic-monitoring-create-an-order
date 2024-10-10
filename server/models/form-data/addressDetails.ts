import z from 'zod'

const AddressDetailsFormDataModel = z.object({
  action: z.string().default('continue'),
  addressLine1: z.string(),
  addressLine2: z.string(),
  addressLine3: z.string(),
  addressLine4: z.string(),
  postcode: z.string(),
  hasAnotherAddress: z.coerce.boolean(),
})

export type AddressDetailsFormData = z.infer<typeof AddressDetailsFormDataModel>

export default AddressDetailsFormDataModel
