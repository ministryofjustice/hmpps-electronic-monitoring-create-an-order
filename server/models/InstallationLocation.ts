import { z } from 'zod'

const InstallationLocationModel = z
  .object({
    location: z
      .string()
      .nullable()
      .transform(val => (val === null ? '' : val)),
  })
  .nullable()
  .optional()

export type InstallationLocation = z.infer<typeof InstallationLocationModel>

export default InstallationLocationModel
