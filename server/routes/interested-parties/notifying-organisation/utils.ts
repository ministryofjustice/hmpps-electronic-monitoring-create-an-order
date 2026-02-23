import { NotifyingOrganisationInput } from './formModel'

export const getNotifyingOrganisationName = (data: Partial<NotifyingOrganisationInput>): string => {
  if (!data.notifyingOrganisation) return ''

  const lookup: Record<string, string | undefined> = {
    PRISON: data.prison,
    YOUTH_CUSTODY_SERVICE: data.youthCustodyServiceRegion,
    CROWN_COURT: data.crownCourt,
    MAGISTRATES_COURT: data.magistratesCourt,
    FAMILY_COURT: data.familyCourt,
    CIVIL_COUNTY_COURT: data.civilCountyCourt,
    YOUTH_COURT: data.youthCourt,
    MILITARY_COURT: data.militaryCourt,
  }

  return lookup[data.notifyingOrganisation] || ''
}

export default { getNotifyingOrganisationName }
