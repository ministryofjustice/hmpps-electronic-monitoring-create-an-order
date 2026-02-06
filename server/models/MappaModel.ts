import { z } from 'zod'
import { YesNoUnknownEnum } from './YesNoUnknown'

const LevelEnum = z.enum(['MAPPA_ONE', 'MAPPA_TWO', 'MAPPA_THREE'])
const CategoryEnum = z.enum(['CATEGORY_ONE', 'CATEGORY_TWO', 'CATEGORY_THREE'])

const MappaModel = z.object({
  level: LevelEnum.nullable().optional(),
  category: CategoryEnum.nullable().optional(),
  isMappa: YesNoUnknownEnum.nullable().optional(),
})

export type Mappa = z.infer<typeof MappaModel>

export default MappaModel
