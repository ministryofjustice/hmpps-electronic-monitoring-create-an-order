import z from 'zod'
import { validationErrors } from '../../../constants/validationErrors'

const NationalSecurityDirectorateFormModel = z.object({
  action: z.string().default('continue'),
  nationalSecurityDirectorate: z.string().nullable().default(null),
})

export const NationalSecurityDirectorateValidator = z
  .object({
    nationalSecurityDirectorate: z.string({ message: validationErrors.contactInformation.pduRequired }),
  })
  .transform(({ nationalSecurityDirectorate }) => ({
    nationalSecurityDirectorate: nationalSecurityDirectorate === '' ? null : nationalSecurityDirectorate,
  }))

export type NationalSecurityDirectorateModel = z.output<typeof NationalSecurityDirectorateValidator>

export default NationalSecurityDirectorateFormModel
