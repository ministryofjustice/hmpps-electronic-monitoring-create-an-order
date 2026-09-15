import { NotifyingOrganisation } from './NotifyingOrganisation'

export const orderCohorts = ['STANDARD', 'HOME_OFFICE', 'COURT', 'FAMILY_COURT'] as const

export type OrderCohort = (typeof orderCohorts)[number]

const notifyingOrganisationCohorts: Record<NotifyingOrganisation, OrderCohort> = {
  HOME_OFFICE: 'HOME_OFFICE',
  PRISON: 'STANDARD',
  PROBATION: 'STANDARD',
  YOUTH_CUSTODY_SERVICE: 'STANDARD',
  CIVIL_COUNTY_COURT: 'COURT',
  CROWN_COURT: 'COURT',
  FAMILY_COURT: 'FAMILY_COURT',
  MAGISTRATES_COURT: 'COURT',
  MILITARY_COURT: 'COURT',
  SCOTTISH_COURT: 'COURT',
  YOUTH_COURT: 'COURT',
}

export const getOrderCohort = (notifyingOrganisation: NotifyingOrganisation | null | undefined): OrderCohort => {
  return notifyingOrganisation ? notifyingOrganisationCohorts[notifyingOrganisation] : 'STANDARD'
}
