import { z } from 'zod'

export const ResponsibleOrganisationEnum = z.enum([
  'YJS',
  'YCS',
  'PROBATION',
  'FIELD_MONITORING_SERVICE',
  'HOME_OFFICE',
  'POLICE',
])

export type ResponsibeOrganisation = z.infer<typeof ResponsibleOrganisationEnum>
