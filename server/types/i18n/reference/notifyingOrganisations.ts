import ReferenceData from './reference'

type NotifyingOrganisations = ReferenceData<
  'PRISON' | 'PROBATION' | 'HOME_OFFICE' | 'CROWN_COURT' | 'FAMILY_COURT' | 'MAGISTRATES_COURT' | 'SCOTTISH_COURT'
>

type NotifyingOrganisationsDDv5 = ReferenceData<
  | 'CIVIL_COUNTY_COURT'
  | 'CROWN_COURT'
  | 'FAMILY_COURT'
  | 'HOME_OFFICE'
  | 'MAGISTRATES_COURT'
  | 'MILITARY_COURT'
  | 'PRISON'
  | 'PROBATION'
  | 'SCOTTISH_COURT'
  | 'YOUTH_CUSTODY_SERVICE'
  | 'YOUTH_COURT'
>

export default NotifyingOrganisations

export { NotifyingOrganisationsDDv5 }
