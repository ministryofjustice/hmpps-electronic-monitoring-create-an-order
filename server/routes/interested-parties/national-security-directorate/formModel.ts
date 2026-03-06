import z from 'zod'
import { validationErrors } from '../../../constants/validationErrors'

const NationalSecurityDirectorateFormModel = z.object({
  action: z.string().default('continue'),
  nsd: z.string().nullable().default(null),
})

export const NationalSecurityDirectorateValidator = z
  .object({
    nsd: z.string({ message: validationErrors.contactInformation.pduRequired }),
  })
  .transform(({ nsd }) => ({
    nsd: nsd === '' ? null : nsd,
  }))

export type NationalSecurityDirectorateModel = z.output<typeof NationalSecurityDirectorateValidator>

export default NationalSecurityDirectorateFormModel
