import { z } from 'zod'

const MonitoringConditionsModel = z.object({
  orderType: z.string().nullable(),
  acquisitiveCrime: z.boolean().nullable(),
  dapol: z.boolean().nullable(),
  curfew: z.boolean().nullable(),
  exclusionZone: z.boolean().nullable(),
  trail: z.boolean().nullable(),
  mandatoryAttendance: z.boolean().nullable(),
  alcohol: z.boolean().nullable(),
  devicesRequired: z.string().nullable(),
})

export type MonitoringConditions = z.infer<typeof MonitoringConditionsModel>

export default MonitoringConditionsModel
