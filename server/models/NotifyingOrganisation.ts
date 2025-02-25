import { z } from 'zod'

export const NotifyingOrganisationEnum = z.enum([
  'CROWN_COURT',
  'MAGISTRATES_COURT',
  'PRISON',
  'HOME_OFFICE',
  'SCOTTISH_COURT',
  'FAMILY_COURT',
  'PROBATION',
])

export type NotifyingOrganisation = z.infer<typeof NotifyingOrganisationEnum>
