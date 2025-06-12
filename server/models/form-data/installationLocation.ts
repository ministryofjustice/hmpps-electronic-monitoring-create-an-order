import z from 'zod'

const InstallationLocationFormDataModel = z.object({
  action: z.string().default('continue'),
  location: z.string(),
})

type InstallationLocationFormData = z.infer<typeof InstallationLocationFormDataModel>

export default InstallationLocationFormDataModel
export { InstallationLocationFormData }
