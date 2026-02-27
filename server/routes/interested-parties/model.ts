import { z } from 'zod'
import { NotifyingOrganisationEnum } from '../../models/NotifyingOrganisation'
import { ResponsibleOrganisationEnum } from '../../models/ResponsibleOrganisation'

const InterestedPartiesModel = z.object({
  notifyingOrganisation: NotifyingOrganisationEnum.nullable().optional(),
  notifyingOrganisationName: z.string().nullable().optional(),
  notifyingOrganisationEmail: z.string().nullable().optional(),
  responsibleOrganisation: ResponsibleOrganisationEnum.nullable().optional(),
  responsibleOrganisationRegion: z.string().optional(),
  responsibleOrganisationEmail: z.string().optional(),
  responsibleOfficerFirstName: z.string().nullable().optional(),
  responsibleOfficerLastName: z.string().nullable().optional(),
  responsibleOfficerEmail: z.string().nullable().optional(),
  probationDeliveryUnit: z.string().nullable().optional(),
})

export type InterestedParties = z.infer<typeof InterestedPartiesModel>

export default InterestedPartiesModel
