import z from 'zod'
import { validationErrors } from '../../../constants/validationErrors'

const MappaFormModel = z.object({
  action: z.string(),
  level: z.string().optional(),
  category: z.string().optional(),
})

export const MappaFormValidator = z.object({
  level: z.string({ message: validationErrors.mappa.levelRequired }),
  category: z.string({ message: validationErrors.mappa.categoryRequired }),
})

export type MappaInput = z.infer<typeof MappaFormModel>
export default MappaFormModel
