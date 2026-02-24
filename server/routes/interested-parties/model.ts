import { z } from 'zod'
import { NotifyingOrganisationEnum } from '../../models/NotifyingOrganisation'
import { ResponsibleOrganisationEnum } from '../../models/ResponsibleOrganisation'

const InterestedPartiesModel = z.object({
  notifyingOrganisation: NotifyingOrganisationEnum.nullable().optional(),
  notifyingOrganisationName: z.string().nullable().optional(),
  notifyingOrganisationEmail: z.string().nullable().optional(),
  responsibleOfficerName: z.string().optional(),
  responsibleOfficerPhoneNumber: z.string().nullable().optional(),
  responsibleOrganisation: ResponsibleOrganisationEnum.optional(),
  responsibleOrganisationRegion: z.string().optional(),
  responsibleOrganisationEmail: z.string().optional(),
})

export type InterestedParties = z.infer<typeof InterestedPartiesModel>

export default InterestedPartiesModel
