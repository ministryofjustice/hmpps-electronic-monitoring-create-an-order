import z from 'zod'
import { Organisations } from '../InterestedParties'

const InterestedPartiesFormDataModel = z.object({
  action: z.string().default('continue'),
  notifyingOrganisation: z.string().nullable().default(null),
  notifyingOrganisationName: z.string().default(''),
  notifyingOrganisationEmail: z.string(),
  responsibleOfficerName: z.string(),
  responsibleOfficerPhoneNumber: z.string().transform(val => (val === '' ? null : val)),
  responsibleOrganisation: z.enum(Organisations).nullable().default(null),
  probationRegion: z.string(),
  yjsRegion: z.string(),
  responsibleOrganisationAddressLine1: z.string(),
  responsibleOrganisationAddressLine2: z.string(),
  responsibleOrganisationAddressLine3: z.string(),
  responsibleOrganisationAddressLine4: z.string(),
  responsibleOrganisationAddressPostcode: z.string(),
  responsibleOrganisationPhoneNumber: z.string().transform(val => (val === '' ? null : val)),
  responsibleOrganisationEmail: z.string(),
})

type InterestedPartiesFormData = Omit<z.infer<typeof InterestedPartiesFormDataModel>, 'action'>

export default InterestedPartiesFormDataModel

export { InterestedPartiesFormData }
