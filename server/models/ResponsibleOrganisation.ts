import { z } from 'zod'

export const ResponsibleOrganisationEnum = z.enum([
  'YJS',
  'PROBATION',
  'FIELD_MONITORING_SERVICE',
  'HOME_OFFICE',
  'POLICE',
])

export type ResponsibleOrganisation = z.infer<typeof ResponsibleOrganisationEnum>

export const ResponsibleOrganisationField = ResponsibleOrganisationEnum.or(z.literal(''))
  .nullish()
  .transform((val): ResponsibleOrganisation | null => (val === '' || val == null ? null : val))
