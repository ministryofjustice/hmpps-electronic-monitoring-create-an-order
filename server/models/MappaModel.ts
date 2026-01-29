import { z } from 'zod'

const LevelEnum = z.enum(['MAPPA_ONE', 'MAPPA_TWO', 'MAPPA_THREE'])
const CategoryEnum = z.enum(['CATEGORY_ONE', 'CATEGORY_TWO', 'CATEGORY_THREE'])

const MappaModel = z.object({
  level: LevelEnum.nullable(),
  category: CategoryEnum.nullable(),
})

export type Mappa = z.infer<typeof MappaModel>

export default MappaModel
