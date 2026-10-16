import z from 'zod'

const RiskAtAddressFormModel = z.object({
  action: z.string(),
  riskCategory: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform(val => {
      if (val === undefined) return []
      return Array.isArray(val) ? val : [val]
    }),
})

export default RiskAtAddressFormModel
