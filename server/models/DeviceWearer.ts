import { z } from 'zod'

const DeviceWearerModel = z.object({
  nomisId: z.string().nullable(),
  pncId: z.string().nullable(),
  deliusId: z.string().nullable(),
  prisonNumber: z.string().nullable(),
  homeOfficeReferenceNumber: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  alias: z.string().nullable(),
  dateOfBirth: z.string().datetime().nullable(),
  adultAtTimeOfInstallation: z.boolean().nullable(),
  sex: z.string().nullable(),
  gender: z.string().nullable(),
  disabilities: z
    .string()
    .nullable()
    .transform(val => (val === null ? [] : val.split(','))),
  noFixedAbode: z.boolean().nullable(),
  language: z.string().nullable().optional(),
  interpreterRequired: z.boolean().nullable().optional(),
})

export type DeviceWearer = z.infer<typeof DeviceWearerModel>

export default DeviceWearerModel
