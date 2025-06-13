import { z } from 'zod'

const CurfewAdditionalDetailsFormDataModel = z.object({
  action: z.string().default('continue'),
  curfewAdditionalDetails: z.string().default(''),
  details: z.string().optional(),
})

export type CurfewAdditionalDetailsFormData = z.infer<typeof CurfewAdditionalDetailsFormDataModel>

const CurfewAdditionalDetailsFormDataValidator = z
  .object({
    curfewAdditionalDetails: z.string(),
    details: z.string({ required_error: 'Enter detail of the curfew address boundary' }),
  })
  .superRefine((data, ctx) => {
    if (data.details === 'yes' && data.curfewAdditionalDetails.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter detail of the curfew address boundary',
        fatal: true,
        path: ['curfewAdditionalDetails'],
      })
    }
  })

type CurfewAdditionalDetailsApiRequestBody = z.infer<typeof CurfewAdditionalDetailsFormDataValidator>

export {
  CurfewAdditionalDetailsFormDataModel,
  CurfewAdditionalDetailsApiRequestBody,
  CurfewAdditionalDetailsFormDataValidator,
}
