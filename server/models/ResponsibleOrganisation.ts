import { z } from 'zod'

export const ResponsibleOrganisationEnum = z.enum([
  'YJS',
  'PROBATION',
  'FIELD_MONITORING_SERVICE',
  'HOME_OFFICE',
  'POLICE',
])

export type ResponsibeOrganisation = z.infer<typeof ResponsibleOrganisationEnum>
