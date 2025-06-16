import z from 'zod'
import { validationErrors } from '../../constants/validationErrors'

const InstallationLocationFormDataModel = z.object({
  action: z.string().default('continue'),
  location: z.string().default(''),
})

type InstallationLocationFormData = z.infer<typeof InstallationLocationFormDataModel>

const InstallationLocationFormDataValidator = z.object({
  location: z.string().min(1, validationErrors.installationLocation.locationRequired),
})

export default InstallationLocationFormDataModel
export { InstallationLocationFormData, InstallationLocationFormDataValidator }
