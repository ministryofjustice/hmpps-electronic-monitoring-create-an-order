import z from 'zod'

const IsMappaFormModel = z.object({
  action: z.string(),
  isMappa: z.string(),
})

export type IsMappaInput = z.infer<typeof IsMappaFormModel>
export default IsMappaFormModel
