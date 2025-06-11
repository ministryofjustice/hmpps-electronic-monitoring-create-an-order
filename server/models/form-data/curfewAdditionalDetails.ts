import { z } from 'zod'

const CurfewAdditionalDetailsFormDataModel = z.object({
  action: z.string().default('continue'),
  curfewAdditionalDetails: z.string().default(''),
})

export type CurfewAdditionalDetailsFormData = z.infer<typeof CurfewAdditionalDetailsFormDataModel>

const CurfewAdditionalDetailsFormDataValidator = z.object({
  curfewAdditionalDetails: z.string().min(1, "can't have empty details"),
})

type CurfewAdditionalDetailsApiRequestBody = z.infer<typeof CurfewAdditionalDetailsFormDataValidator>

export {
  CurfewAdditionalDetailsFormDataModel,
  CurfewAdditionalDetailsApiRequestBody,
  CurfewAdditionalDetailsFormDataValidator,
}
