import z from 'zod'
import { DateInputModel, FormDataModel } from './formData'
import { validationErrors } from '../../constants/validationErrors'

const VariationDetailsFormDataParser = FormDataModel.extend({
  variationDate: z.object({
    day: z.string(),
    month: z.string(),
    year: z.string(),
  }),
  variationType: z.string().default(''),
  variationDetails: z.string().optional(),
  variationDetailsAvailable: z.string().optional(),
  orderType: z.string().optional(),
})
const validateVariationDetailsFormData = (formData: VariationDetailsFormData) => {
  const { orderType } = formData
  return z
    .object({
      variationDate: DateInputModel(validationErrors.variationDetails.variationDate),
      variationType: z.string().refine(val => val.length > 1 || orderType !== 'VARIATION', {
        message: validationErrors.variationDetails.variationTypeRequired,
      }),
      variationDetailsAvailable: z.string({
        message: validationErrors.variationDetails.variationDetailsAvailableRequired,
      }),
      variationDetails: z.string(),
    })
    .superRefine((data, ctx) => {
      if (data.variationDetailsAvailable === 'true') {
        if (data.variationDetails.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['variationDetails'],
            message: validationErrors.variationDetails.variationDetailsRequired,
          })
        }
        if (data.variationDetails.length > 200) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['variationDetails'],
            message: validationErrors.variationDetails.variationDetailsTooLong,
          })
        }
      }
    })
    .transform(data => ({
      ...data,
      variationDetailsAvailable: undefined,
    }))
    .parse(formData)
}

type VariationDetailsFormData = Omit<z.infer<typeof VariationDetailsFormDataParser>, 'action'>

export { VariationDetailsFormData, VariationDetailsFormDataParser, validateVariationDetailsFormData }
