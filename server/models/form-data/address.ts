import z from 'zod'
import { validationErrors } from '../../constants/validationErrors'

const AddressFormDataModel = z.object({
  action: z.string().default('continue'),
  addressLine1: z.string(),
  addressLine2: z.string(),
  addressLine3: z.string(),
  addressLine4: z.string(),
  postcode: z.string(),
  hasAnotherAddress: z.string().optional(),
})

export type AddressFormData = Omit<z.infer<typeof AddressFormDataModel>, 'action'>

const AddressFormDataValidator = z
  .object({
    addressType: z.string().optional(),
    addressLine1: z.string().min(1, validationErrors.address.addressLine1Required),
    addressLine2: z.string(),
    addressLine3: z.string().min(1, validationErrors.address.addressLine3Required),
    addressLine4: z.string(),
    postcode: z.string().min(1, validationErrors.address.postcodeRequired),
    hasAnotherAddress: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const isHasAnotherAddressShown = data.addressType === 'primary' || data.addressType === 'secondary'

    if (isHasAnotherAddressShown && data.hasAnotherAddress === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: validationErrors.address.addAnotherRequired,
        fatal: true,
        path: ['hasAnotherAddress'],
      })
    }
  })

type AddressApiRequestBody = z.infer<typeof AddressFormDataValidator>

export { AddressFormDataModel, AddressApiRequestBody, AddressFormDataValidator }
