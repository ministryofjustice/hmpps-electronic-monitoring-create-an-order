import z from 'zod'
import { validationErrors } from '../../constants/validationErrors'
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

const DeviceWearerResponsibleAdultFormDataValidator = z.object({
  relationship: z.string().min(1, validationErrors.responsibleAdult.relationshipRequired),
  otherRelationshipDetails: z.string().max(200, validationErrors.responsibleAdult.otherRelationshipMaxLength),
  fullName: z
    .string()
    .min(1, validationErrors.responsibleAdult.fullNameRequired)
    .max(200, validationErrors.responsibleAdult.fullNameMaxLength),
  contactNumber: z
    .string()
    .nullable()
    .transform(val => (val === '' ? null : val)),
})

export default DeviceWearerResponsibleAdultFormDataModel

export { DeviceWearerResponsibleAdultFormData, DeviceWearerResponsibleAdultFormDataValidator }
