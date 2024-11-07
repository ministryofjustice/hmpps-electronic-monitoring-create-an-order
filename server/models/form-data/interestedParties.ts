import z from 'zod'
import { Organisations } from '../InterestedParties'

const InterestedPartiesFormDataModel = z.object({
  action: z.string().default('continue'),
  notifyingOrganisationEmail: z.string(),
  responsibleOfficerName: z.string(),
  responsibleOfficerPhoneNumber: z.string().transform(val => (val === '' ? null : val)),
  responsibleOrganisation: z.enum(Organisations).nullable().default(null),
  responsibleOrganisationRegion: z.string(),
  responsibleOrganisationAddressLine1: z.string(),
  responsibleOrganisationAddressLine2: z.string(),
  responsibleOrganisationAddressLine3: z.string(),
  responsibleOrganisationAddressLine4: z.string(),
  responsibleOrganisationAddressPostcode: z.string(),
  responsibleOrganisationPhoneNumber: z.string().transform(val => (val === '' ? null : val)),
  responsibleOrganisationEmail: z.string(),
})

export default InterestedPartiesFormDataModel
