import { z } from 'zod'
import { validationErrors } from '../../../constants/validationErrors'
import { FormDataModel } from '../../../models/form-data/formData'

export const INTERPRETER_REQUIRED_DONT_KNOW = 'DONT_KNOW'

const LanguageFormModel = FormDataModel.extend({
  interpreterRequired: z.string().default(''),
  language: z.string().default(''),
})

// Same rules and messages as the API (UpdateDeviceWearerDto interpreterRequired and isLanguage).
// "Don't know" cannot be sent to the API, so it is sent as no interpreter needed (agreed decision D2).
export const LanguageFormValidator = z
  .object({
    interpreterRequired: z.enum(['true', 'false', INTERPRETER_REQUIRED_DONT_KNOW], {
      message: validationErrors.deviceWearer.interpreterRequired,
    }),
    language: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.interpreterRequired === 'true' && !data.language) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: validationErrors.deviceWearer.languageRequired,
        path: ['language'],
      })
    }
  })
  .transform(({ interpreterRequired, language }) => {
    const interpreterNeeded = interpreterRequired === 'true'
    return { interpreterRequired: interpreterNeeded, language: interpreterNeeded ? language : '' }
  })

export type LanguageFormInput = z.infer<typeof LanguageFormModel>
export default LanguageFormModel
