import { z } from 'zod'

const ContactDetailsModel = z.object({
  contactNumber: z.string().default(''),
})

export type ContactDetails = z.infer<typeof ContactDetailsModel>

export default ContactDetailsModel
