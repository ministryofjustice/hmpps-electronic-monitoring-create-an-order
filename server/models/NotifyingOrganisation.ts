import { z } from 'zod'

export const NotifyingOrganisationEnum = z.enum([
  'CIVIL_COUNTY_COURT',
  'CROWN_COURT',
  'FAMILY_COURT',
  'MAGISTRATES_COURT',
  'PRISON',
  'HOME_OFFICE',
  'SCOTTISH_COURT',
  'FAMILY_COURT',
  'PROBATION',
])

export type NotifyingOrganisation = z.infer<typeof NotifyingOrganisationEnum>
