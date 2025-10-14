import z from 'zod'
import { validationErrors } from '../../constants/validationErrors'

const ProbationDeliveryUnitFormDataModel = z.object({
  action: z.string().default('continue'),
  unit: z.string().nullable().default(null),
})

export const validateUpdateProbationDevliveryUnitInput = (data: Omit<ProbationDeliveryUnitFormData, 'action'>) => {
  return z
    .object({
      unit: z.string({ message: validationErrors.contactInformation.pduRequired }),
    })
    .transform(({ unit }) => ({
      unit: unit === '' ? null : unit,
    }))
    .parse(data)
}

type ProbationDeliveryUnitFormData = z.infer<typeof ProbationDeliveryUnitFormDataModel>

export default ProbationDeliveryUnitFormDataModel
export { ProbationDeliveryUnitFormData }
