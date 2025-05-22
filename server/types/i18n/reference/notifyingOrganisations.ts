import ReferenceData from './reference'

type NotifyingOrganisations = ReferenceData<
  'PRISON' | 'PROBATION' | 'HOME_OFFICE' | 'CROWN_COURT' | 'FAMILY_COURT' | 'MAGISTRATES_COURT' | 'SCOTTISH_COURT'
>

export default NotifyingOrganisations
