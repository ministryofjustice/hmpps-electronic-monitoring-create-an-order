import z from 'zod'

const ProbationDeliveryUnitFormDataModel = z.object({
  action: z.string().default('continue'),
  unit: z
    .string()
    .nullable()
    .default(null)
    .transform(val => (val === '' ? null : val)),
})

type ProbationDeliveryUnitFormData = z.infer<typeof ProbationDeliveryUnitFormDataModel>

export default ProbationDeliveryUnitFormDataModel
export { ProbationDeliveryUnitFormData }
