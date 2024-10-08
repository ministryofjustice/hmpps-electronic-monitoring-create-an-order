import z from 'zod'

const ContactDetailsFormDataModel = z.object({
  action: z.string().default('continue'),
  contactNumber: z.string().transform(val => (val === '' ? null : val)),
})

export type ContactDetailsFormData = z.infer<typeof ContactDetailsFormDataModel>

export default ContactDetailsFormDataModel
