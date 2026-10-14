import z from 'zod'

const RiskBehaviourFormModel = z.object({
  action: z.string(),
  possibleRisk: z.union([z.string(), z.array(z.string())]).transform(val => (Array.isArray(val) ? val : [val])),
})

export type RiskBehaviourInput = z.infer<typeof RiskBehaviourFormModel>
export default RiskBehaviourFormModel
