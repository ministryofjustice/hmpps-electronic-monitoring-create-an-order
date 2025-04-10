import { z } from 'zod'

const ContactDetailsModel = z
  .object({
    contactNumber: z
      .string()
      .nullable()
      .transform(val => (val === null ? '' : val)),
  })
  .nullable()

export type ContactDetails = z.infer<typeof ContactDetailsModel>

export default ContactDetailsModel
