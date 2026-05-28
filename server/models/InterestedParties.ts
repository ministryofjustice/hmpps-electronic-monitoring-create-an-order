import { z } from 'zod'
import { ResponsibleOrganisationField } from './ResponsibleOrganisation'
import { NotifyingOrganisationEnum } from './NotifyingOrganisation'

const InterestedPartiesModel = z
  .object({
    notifyingOrganisation: NotifyingOrganisationEnum.nullable().optional(),
    notifyingOrganisationName: z.string().nullable().optional(),
    notifyingOrganisationEmail: z.string().nullable().optional(),
    responsibleOfficerName: z.string().nullable().optional(),
    responsibleOfficerPhoneNumber: z.string().nullable().optional(),
    responsibleOrganisation: ResponsibleOrganisationField.nullable(),
    responsibleOrganisationRegion: z.string().nullable().optional(),
    responsibleOrganisationEmail: z.string().nullable().optional(),
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
