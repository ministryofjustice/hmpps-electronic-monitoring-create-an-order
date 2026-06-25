import { z } from 'zod'
import { DateInputModel } from '../../../models/form-data/formData'
import { validationErrors } from '../../../constants/validationErrors'

const OffenceFormModel = z.object({
  action: z.string(),
  id: z.string().optional(),
  offenceType: z.string().default('').optional(),
  offenceDate: z
    .object({
      day: z.string().default(''),
      month: z.string().default(''),
      year: z.string().default(''),
    })
    .nullable()
    .optional(),
  // eslint-disable-next-line no-nested-ternary
  offences: z.preprocess(v => (v == null ? undefined : Array.isArray(v) ? v : [v]), z.array(z.string()).optional()),
})

export const OffenceFormValidator = (dateRequired: boolean | null, multiOffence: boolean | null) =>
  z.object({
    id: z.string().optional(),
    offenceType: multiOffence ? z.string().optional() : z.string().min(1, validationErrors.offence.offenceTypeRequired),
    offenceDate: dateRequired ? DateInputModel(validationErrors.offence.offenceDate) : z.string().optional(),
    offences: multiOffence
      ? z.array(z.string()).min(1, validationErrors.offence.offenceTypeRequired)
      : z.array(z.string()).optional(),
  })

export type OffenceInput = z.infer<typeof OffenceFormModel>
export default OffenceFormModel
