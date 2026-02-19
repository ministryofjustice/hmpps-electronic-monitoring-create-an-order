import z from 'zod'
import { NotifyingOrganisationEnum } from '../../../models/NotifyingOrganisation'

const NotifyingOrganisationBaseSchema = z.object({
  notifyingOrganisation: NotifyingOrganisationEnum.nullable().default(null),
  civilCountyCourt: z.string().default(''),
  crownCourt: z.string().default(''),
  familyCourt: z.string().default(''),
  magistratesCourt: z.string().default(''),
  militaryCourt: z.string().default(''),
  prison: z.string().default(''),
  youthCourt: z.string().default(''),
  youthCustodyServiceRegion: z.string().default(''),
  notifyingOrganisationEmail: z.string().default(''),
})

const getNotifyingOrganisationName = (data: z.input<typeof NotifyingOrganisationBaseSchema>): string => {
  switch (data.notifyingOrganisation) {
    case 'PRISON':
      return data.prison || ''
    case 'YOUTH_CUSTODY_SERVICE':
      return data.youthCustodyServiceRegion || ''
    case 'CROWN_COURT':
      return data.crownCourt || ''
    case 'MAGISTRATES_COURT':
      return data.magistratesCourt || ''
    case 'FAMILY_COURT':
      return data.familyCourt || ''
    case 'CIVIL_COUNTY_COURT':
      return data.civilCountyCourt || ''
    case 'YOUTH_COURT':
      return data.youthCourt || ''
    case 'MILITARY_COURT':
      return data.militaryCourt || ''
    default:
      return ''
  }
}

const NotifyingOrganisationFormModel = NotifyingOrganisationBaseSchema.transform(data => ({
  ...data,
  notifyingOrganisationName: getNotifyingOrganisationName(data),
}))

export type NotifyingOrganisationInput = z.input<typeof NotifyingOrganisationFormModel>
export type NotifyingOrganisationForm = z.output<typeof NotifyingOrganisationFormModel>

export default NotifyingOrganisationFormModel
