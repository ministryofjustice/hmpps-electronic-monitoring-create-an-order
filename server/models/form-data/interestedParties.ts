import z from 'zod'
import { ResponsibleOrganisationEnum } from '../ResponsibleOrganisation'
import { NotifyingOrganisationEnum } from '../NotifyingOrganisation'
import { FormDataModel } from './formData'

const InterestedPartiesFormDataModel = FormDataModel.extend({
  notifyingOrganisation: NotifyingOrganisationEnum.nullable().default(null),
  civilCountyCourt: z.string().default(''),
  crownCourt: z.string().default(''),
  magistratesCourt: z.string().default(''),
  prison: z.string().default(''),
  notifyingOrganisationEmail: z.string().default(''),
  notifyingOrgProbationRegion: z.string().default(''),
  responsibleOfficerName: z.string().default(''),
  responsibleOfficerPhoneNumber: z.string().default(''),
  responsibleOrganisation: ResponsibleOrganisationEnum.nullable().default(null),
  responsibleOrgProbationRegion: z.string().default(''),
  yjsRegion: z.string().default(''),
  responsibleOrganisationEmail: z.string().default(''),
})

type InterestedPartiesFormData = Omit<z.infer<typeof InterestedPartiesFormDataModel>, 'action'>

export default InterestedPartiesFormDataModel

export { InterestedPartiesFormData }
