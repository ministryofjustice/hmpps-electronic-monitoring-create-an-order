import z from 'zod'

const MappaFormModel = z.object({
  action: z.string(),
  level: z.string().optional(),
  category: z.string().optional(),
})

export type MappaInput = z.infer<typeof MappaFormModel>
export default MappaFormModel
