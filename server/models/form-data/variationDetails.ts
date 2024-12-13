import z from 'zod'
import { DateInputModel, FormDataModel } from './formData'

const VariationDetailsFormDataParser = FormDataModel.extend({
  variationDate: z.object({
    day: z.string(),
    month: z.string(),
    year: z.string(),
  }),
  variationType: z.string().default(''),
})

const VariationDetailsFormDataValidator = z.object({
  variationDate: DateInputModel.pipe(z.string({ message: 'Variation date is required' }).datetime()),
  variationType: z.string().min(1, 'Variation type is required'),
})

type VariationDetailsFormData = Omit<z.infer<typeof VariationDetailsFormDataParser>, 'action'>

export { VariationDetailsFormData, VariationDetailsFormDataParser, VariationDetailsFormDataValidator }
