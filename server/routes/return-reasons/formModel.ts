import z from 'zod'

const ReturnReasonsFormModel = z.object({
  action: z.string(),
})

export type ReturnReasonsInput = z.infer<typeof ReturnReasonsFormModel>
export default ReturnReasonsFormModel
