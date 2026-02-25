import z from 'zod'
import { validationErrors } from '../../../constants/validationErrors'

const ProbationDeliveryUnitFormModel = z.object({
  action: z.string().default('continue'),
  unit: z.string().optional(),
})

export const ProbationDeliveryUnitValidator = ProbationDeliveryUnitFormModel.superRefine((data, ctx) => {
  if (!data.unit) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: validationErrors.probationDeliveryUnit.pduRequired,
      path: ['unit'],
    })
  }
}).transform(data => {
  return {
    unit: data.unit === '' ? null : data.unit,
  }
})

export type ProbationDeliveryUnitInput = z.output<typeof ProbationDeliveryUnitValidator>

export default ProbationDeliveryUnitFormModel