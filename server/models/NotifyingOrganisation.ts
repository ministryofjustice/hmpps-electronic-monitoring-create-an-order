import { z } from 'zod'

export const NotifyingOrganisationEnum = z.enum([
  'CIVIL_COUNTY_COURT',
  'CROWN_COURT',
  'FAMILY_COURT',
  'HOME_OFFICE',
  'MAGISTRATES_COURT',
  'MILITARY_COURT',
  'PRISON',
  'PROBATION',
  'SCOTTISH_COURT',
  'YOUTH_COURT',
])

export type NotifyingOrganisation = z.infer<typeof NotifyingOrganisationEnum>
