import { z } from 'zod'
import { validationErrors } from '../../../constants/validationErrors'

const OffenceOtherInfoFormModel = z.object({
  action: z.string().default('continue'),
  hasOtherInformation: z.string().default(''),
  otherInformationDetails: z.string().default(''),
})

export const OffenceOtherInfoFormDataValidator = z
  .object({
    hasOtherInformation: z.string().min(1, {
      message: validationErrors.offenceOtherInformation.hasOtherInformationRequired,
    }),
    otherInformationDetails: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.hasOtherInformation === 'yes') {
      const details = data.otherInformationDetails?.trim() || ''

      if (details.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['otherInformationDetails'],
          message: validationErrors.offenceOtherInformation.detailsRequired,
        })
      } else if (details.length > 500) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['otherInformationDetails'],
          message: validationErrors.offenceOtherInformation.tooLong,
        })
      }
    }
  })
  .transform(data => ({
    ...data,
    otherInformationDetails: data.hasOtherInformation === 'no' ? '' : data.otherInformationDetails,
  }))

export type OffenceOtherInfoInput = z.infer<typeof OffenceOtherInfoFormModel>
export default OffenceOtherInfoFormModel
