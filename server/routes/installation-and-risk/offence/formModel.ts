import { z } from 'zod'
import { DateInputModel } from '../../../models/form-data/formData'
import { validationErrors } from '../../../constants/validationErrors'

const OffenceFormModel = z.object({
  action: z.string(),
  id: z.string().optional(),
  offenceType: z.string().default(''),
  offenceDate: z
    .object({
      day: z.string().default(''),
      month: z.string().default(''),
      year: z.string().default(''),
    })
    .nullable()
    .optional(),
})

export const OffenceFormValidator = (dateRequired: boolean | null) =>
  z.object({
    offenceType: z.string().min(1, validationErrors.offence.offenceTypeRequired),
    offenceDate: dateRequired ? DateInputModel(validationErrors.offence.offenceDate) : z.string().optional(),
  })

export type OffenceInput = z.infer<typeof OffenceFormModel>
export default OffenceFormModel
