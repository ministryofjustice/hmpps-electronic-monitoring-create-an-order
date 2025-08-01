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
})

const VariationDetailsFormDataValidator = z.object({
  // This might need error messages passing
  variationDate: DateInputModel(validationErrors.variationDetails.variationDate),
  variationType: z.string().min(1, validationErrors.variationDetails.variationTypeRequired),
  variationDetails: z
    .string()
    .min(1, validationErrors.variationDetails.variationDetailsRequired)
    .max(200, validationErrors.variationDetails.variationDetailsTooLong),
})

type VariationDetailsFormData = Omit<z.infer<typeof VariationDetailsFormDataParser>, 'action'>

export { VariationDetailsFormData, VariationDetailsFormDataParser, VariationDetailsFormDataValidator }
