import { z } from 'zod'

const NotifyingOrganisationModel = z.object({
  notifyingOrganisationEmail: z.string().nullable(),
  officerName: z.string().nullable(),
  officerPhoneNumber: z.string().nullable(),
  organisationType: z.string().nullable(),
  organisationRegion: z.string().nullable(),
  organisationAddressLine1: z.string().nullable(),
  organisationAddressLine2: z.string().nullable(),
  organisationAddressLine3: z.string().nullable(),
  organisationAddressLine4: z.string().nullable(),
  organisationAddressPostcode: z.string().nullable(),
  organisationPhoneNumber: z.string().nullable(),
  organisationEmail: z.string().nullable(),
})

export type NotifyingOrganisation = z.infer<typeof NotifyingOrganisationModel>

export default NotifyingOrganisationModel
