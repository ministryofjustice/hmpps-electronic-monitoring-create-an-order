import z from 'zod'
import { ResponsibleOrganisationEnum } from '../ResponsibleOrganisation'
import { NotifyingOrganisationEnum } from '../NotifyingOrganisation'
import { FormDataModel } from './formData'

const InterestedPartiesFormDataModel = FormDataModel.extend({
  notifyingOrganisation: NotifyingOrganisationEnum.nullable().default(null),
  crownCourt: z.string().default(''),
  magistratesCourt: z.string().default(''),
  prison: z.string().default(''),
  notifyingOrganisationEmail: z.string().default(''),
  responsibleOfficerName: z.string().default(''),
  responsibleOfficerPhoneNumber: z.string().default(''),
  responsibleOrganisation: ResponsibleOrganisationEnum.nullable().default(null),
  probationRegion: z.string().default(''),
  yjsRegion: z.string().default(''),
  responsibleOrganisationAddressLine1: z.string().default(''),
  responsibleOrganisationAddressLine2: z.string().default(''),
  responsibleOrganisationAddressLine3: z.string().default(''),
  responsibleOrganisationAddressLine4: z.string().default(''),
  responsibleOrganisationAddressPostcode: z.string().default(''),
  responsibleOrganisationPhoneNumber: z.string().default(''),
  responsibleOrganisationEmail: z.string().default(''),
})

type InterestedPartiesFormData = Omit<z.infer<typeof InterestedPartiesFormDataModel>, 'action'>

export default InterestedPartiesFormDataModel

export { InterestedPartiesFormData }
