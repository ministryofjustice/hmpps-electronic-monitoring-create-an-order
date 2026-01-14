import { z } from 'zod'
import { DateInputModel } from '../../../models/form-data/formData'
import { validationErrors } from '../../../constants/validationErrors'

export const DapoFormModel = z.object({
  action: z.string(),
  clause: z.string(),
  date: z.object({
    day: z.string().default(''),
    month: z.string().default(''),
    year: z.string().default(''),
  }),
})

export const DapoFormValidator = z.object({
  clause: z.string().min(1, validationErrors.dapo.clause),
  date: DateInputModel(validationErrors.dapo.date),
})

export type DapoInput = z.infer<typeof DapoFormModel>
export default DapoFormModel
