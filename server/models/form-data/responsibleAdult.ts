import z from 'zod'
import { FormDataModel } from './formData'

const DeviceWearerResponsibleAdultFormDataModel = FormDataModel.extend({
  relationship: z.string().default(''),
  otherRelationshipDetails: z.string(),
  fullName: z.string(),
  contactNumber: z
    .string()
    .nullable()
    .transform(val => (val === '' ? null : val)),
})

type DeviceWearerResponsibleAdultFormData = Omit<z.infer<typeof DeviceWearerResponsibleAdultFormDataModel>, 'action'>

export default DeviceWearerResponsibleAdultFormDataModel

export { DeviceWearerResponsibleAdultFormData }
