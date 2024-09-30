import { z } from 'zod'

const DeviceWearerModel = z.object({
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  preferredName: z.string().nullable(),
  gender: z.string().nullable(),
  dateOfBirth: z.string().datetime().nullable(),
})

export type DeviceWearer = z.infer<typeof DeviceWearerModel>

export default DeviceWearerModel
