import { z } from 'zod'
import { validationErrors } from '../../../constants/validationErrors'

const ResponsibleOfficerFormModel = z.object({
  action: z.string(),
  responsibleOfficerFirstName: z.string().trim(),
  responsibleOfficerLastName: z.string().trim(),
  responsibleOfficerEmail: z.string().trim(),
})

export const ResponsibleOfficerFormValidator = z.object({
  responsibleOfficerFirstName: z.string().min(1, validationErrors.responsibleOfficer.firstNameRequired),
  responsibleOfficerLastName: z.string().min(1, validationErrors.responsibleOfficer.lastNameRequired),
  responsibleOfficerEmail: z.string().min(1, validationErrors.responsibleOfficer.emailRequired),
})

export type ResponsibleOfficer = z.infer<typeof ResponsibleOfficerFormModel>
export default ResponsibleOfficerFormModel
