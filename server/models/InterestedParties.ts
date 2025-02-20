import { z } from 'zod'
import AddressModel from './Address'
import { ResponsibleOrganisationEnum } from './ResponsibleOrganisation'
import { NotifyingOrganisationEnum } from './NotifyingOrganisation'

const InterestedPartiesModel = z
  .object({
    notifyingOrganisation: NotifyingOrganisationEnum,
    notifyingOrganisationName: z.string(),
    notifyingOrganisationEmail: z.string(),
    responsibleOfficerName: z.string(),
    responsibleOfficerPhoneNumber: z.string().nullable(),
    responsibleOrganisation: ResponsibleOrganisationEnum,
    responsibleOrganisationRegion: z.string(),
    responsibleOrganisationAddress: AddressModel,
    responsibleOrganisationPhoneNumber: z.string().nullable(),
    responsibleOrganisationEmail: z.string(),
  })
  .transform(({ responsibleOrganisationAddress, ...interestedParties }) => {
    return {
      ...interestedParties,
      responsibleOrganisationAddressLine1: responsibleOrganisationAddress.addressLine1,
      responsibleOrganisationAddressLine2: responsibleOrganisationAddress.addressLine2,
      responsibleOrganisationAddressLine3: responsibleOrganisationAddress.addressLine3,
      responsibleOrganisationAddressLine4: responsibleOrganisationAddress.addressLine4,
      responsibleOrganisationAddressPostcode: responsibleOrganisationAddress.postcode,
    }
  })

export type InterestedParties = z.infer<typeof InterestedPartiesModel>

export default InterestedPartiesModel
