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
  variationDetails: z.string().default(''),
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
      variationDetails: z
        .string()
        .min(1, validationErrors.variationDetails.variationDetailsRequired)
        .max(200, validationErrors.variationDetails.variationDetailsTooLong),
    })
    .parse(formData)
}

type VariationDetailsFormData = Omit<z.infer<typeof VariationDetailsFormDataParser>, 'action'>

export { VariationDetailsFormData, VariationDetailsFormDataParser, validateVariationDetailsFormData }
