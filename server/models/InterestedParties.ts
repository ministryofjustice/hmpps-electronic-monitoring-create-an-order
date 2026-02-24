import { z } from 'zod'
import { ResponsibleOrganisationEnum } from './ResponsibleOrganisation'
import { NotifyingOrganisationEnum } from './NotifyingOrganisation'

const InterestedPartiesModel = z
  .object({
    notifyingOrganisation: NotifyingOrganisationEnum.nullable(),
    notifyingOrganisationName: z.string().nullable(),
    notifyingOrganisationEmail: z.string().nullable(),
    responsibleOfficerName: z.string().nullable().optional(),
    responsibleOfficerPhoneNumber: z.string().nullable().optional(),
    responsibleOrganisation: ResponsibleOrganisationEnum,
    responsibleOrganisationRegion: z.string(),
    responsibleOrganisationEmail: z.string(),
    responsibleOfficerFirstName: z.string().nullable().optional(),
    responsibleOfficerLastName: z.string().nullable().optional(),
    responsibleOfficerEmail: z.string().nullable().optional(),
  })
  .transform(({ ...interestedParties }) => {
    return {
      ...interestedParties,
    }
  })

export type InterestedParties = z.infer<typeof InterestedPartiesModel>

export default InterestedPartiesModel
