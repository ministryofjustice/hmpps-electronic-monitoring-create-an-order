import { z } from 'zod'

export const notifyingOrganisationCourts = [
  'CIVIL_COUNTY_COURT',
  'CROWN_COURT',
  'FAMILY_COURT',
  'MAGISTRATES_COURT',
  'MILITARY_COURT',
  'SCOTTISH_COURT',
  'YOUTH_COURT',
] as const

export const notifyingOrganisations = [
  'HOME_OFFICE',
  'PRISON',
  'PROBATION',
  'YOUTH_CUSTODY_SERVICE',
  ...notifyingOrganisationCourts,
] as const

export const NotifyingOrganisationEnum = z.enum(notifyingOrganisations)

export type NotifyingOrganisation = z.infer<typeof NotifyingOrganisationEnum>
