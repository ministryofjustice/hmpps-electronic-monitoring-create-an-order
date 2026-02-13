import { z } from 'zod'
import { validationErrors } from '../../constants/validationErrors'

const CurfewAdditionalDetailsFormDataModel = z.object({
  action: z.string().default('continue'),
  curfewAdditionalDetails: z.string().default(''),
  details: z.string().optional(),
})

export type CurfewAdditionalDetailsFormData = z.infer<typeof CurfewAdditionalDetailsFormDataModel>

const CurfewAdditionalDetailsFormDataValidator = z
  .object({
    curfewAdditionalDetails: z.string(),
    details: z.string({ required_error: validationErrors.curfewAdditionalDetails.changeCurfewDetailsRequired }),
  })
  .superRefine((data, ctx) => {
    if (data.details === 'yes') {
      if (data.curfewAdditionalDetails.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: validationErrors.curfewAdditionalDetails.curfewDetailsRequired,
          fatal: true,
          path: ['curfewAdditionalDetails'],
        })
      }
      if (data.curfewAdditionalDetails.length > 500) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: validationErrors.curfewAdditionalDetails.curfewDetailsTooLong,
          fatal: true,
          path: ['curfewAdditionalDetails'],
        })
      }
    }
  })

type CurfewAdditionalDetailsApiRequestBody = z.infer<typeof CurfewAdditionalDetailsFormDataValidator>

export {
  CurfewAdditionalDetailsFormDataModel,
  CurfewAdditionalDetailsApiRequestBody,
  CurfewAdditionalDetailsFormDataValidator,
}
