import { z } from 'zod'
import EnforcementZoneTypes from './EnforcementZoneTypes'

const EnforcementZoneModel = z.object({
  zoneType: z.nativeEnum(EnforcementZoneTypes).nullable(),
  startDate: z.string().datetime().nullable(),
  endDate: z.string().datetime().nullable(),
  description: z.string().nullable(),
  duration: z.string().nullable(),
  fileName: z.string().nullable(),
  fileId: z.string().nullable(),
  zoneId: z.number().nullable(),
})

export type EnforcementZone = z.infer<typeof EnforcementZoneModel>

export default EnforcementZoneModel
