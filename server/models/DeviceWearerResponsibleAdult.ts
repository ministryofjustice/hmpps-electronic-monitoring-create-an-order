import { z } from 'zod'

const DeviceWearerResponsibleAdultModel = z.object({
  relationship: z.string().nullable(),
  otherRelationshipDetails: z.string().nullable(),
  fullName: z.string().nullable(),
  contactNumber: z.string().nullable(),
})

export type DeviceWearerResponsibleAdult = z.infer<typeof DeviceWearerResponsibleAdultModel>

export default DeviceWearerResponsibleAdultModel
