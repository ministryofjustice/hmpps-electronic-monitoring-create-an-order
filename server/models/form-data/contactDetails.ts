import z from 'zod'
import { validationErrors } from '../../constants/validationErrors'

const ContactDetailsFormDataModel = z.object({
  action: z.string().default('continue'),
  phoneNumberAvailable: z.string().optional(),
  contactNumber: z.string().optional(),
})

export const ContactDetailsFormDataValidator = z
  .object({
    phoneNumberAvailable: z.string({
      required_error: validationErrors.contactInformation.phoneNumberAvailableRequired,
    }),
    contactNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.phoneNumberAvailable === 'true') {
      const contactNumber = data.contactNumber?.trim() || ''
      if (contactNumber.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: validationErrors.contactInformation.phoneNumberRequired,
          fatal: true,
          path: ['contactNumber'],
        })
      }
    }
  })

export type ContactDetailsFormData = Omit<z.infer<typeof ContactDetailsFormDataModel>, 'action'>

export default ContactDetailsFormDataModel
