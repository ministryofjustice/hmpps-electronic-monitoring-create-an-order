import z from 'zod'

const MappaFormModel = z.object({
  action: z.string(),
  level: z.string(),
  category: z.string(),
})

export type MappaInput = z.infer<typeof MappaFormModel>
export default MappaFormModel
