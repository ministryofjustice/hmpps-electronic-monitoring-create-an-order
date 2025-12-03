import { z } from 'zod'
import { ResponsibleOrganisationEnum } from './ResponsibleOrganisation'
import { NotifyingOrganisationEnum } from './NotifyingOrganisation'

const InterestedPartiesModel = z
  .object({
    notifyingOrganisation: NotifyingOrganisationEnum.nullable(),
    notifyingOrganisationName: z.string().nullable(),
    notifyingOrganisationEmail: z.string().nullable(),
    responsibleOfficerName: z.string(),
    responsibleOfficerPhoneNumber: z.string().nullable(),
    responsibleOrganisation: ResponsibleOrganisationEnum,
    responsibleOrganisationRegion: z.string(),
    responsibleOrganisationEmail: z.string(),
  })
  .transform(({ ...interestedParties }) => {
    return {
      ...interestedParties,
    }
  })

export type InterestedParties = z.infer<typeof InterestedPartiesModel>

export default InterestedPartiesModel
