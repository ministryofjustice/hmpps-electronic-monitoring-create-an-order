import { z } from 'zod'

const ProbationDeliveryUnitModel = z
  .object({
    unit: z
      .string()
      .nullable()
      .transform(val => (val === null ? '' : val)),
  })
  .nullable()
  .optional()

export type ProbationDeliveryUnit = z.infer<typeof ProbationDeliveryUnitModel>

export default ProbationDeliveryUnitModel
