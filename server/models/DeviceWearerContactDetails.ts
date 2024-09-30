import { z } from 'zod'

const DeviceWearerContactDetailsModel = z.object({
  contactNumber: z.string().nullable(),
})

export type DeviceWearerContactDetails = z.infer<typeof DeviceWearerContactDetailsModel>

export default DeviceWearerContactDetailsModel
