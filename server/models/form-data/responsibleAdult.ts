import z from 'zod'

const DeviceWearerResponsibleAdultFormDataModel = z.object({
  action: z.string(),
  relationship: z.string().default(''),
  otherRelationshipDetails: z.string(),
  fullName: z.string(),
  contactNumber: z.string().transform(val => (val === '' ? null : val)),
})

type DeviceWearerResponsibleAdultFormData = z.infer<typeof DeviceWearerResponsibleAdultFormDataModel>

export default DeviceWearerResponsibleAdultFormDataModel

export { DeviceWearerResponsibleAdultFormData }
