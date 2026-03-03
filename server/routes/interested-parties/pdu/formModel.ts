import z from 'zod'
import { validationErrors } from '../../../constants/validationErrors'

const ProbationDeliveryUnitFormModel = z.object({
  action: z.string().default('continue'),
  unit: z.string().nullable().default(null),
})

export const ProbationDeliveryUnitValidator = z
  .object({
    unit: z.string({ message: validationErrors.contactInformation.pduRequired }),
  })
  .transform(({ unit }) => ({
    unit: unit === '' ? null : unit,
  }))

export type ProbationDeliveryUnitInput = z.output<typeof ProbationDeliveryUnitValidator>

export default ProbationDeliveryUnitFormModel
