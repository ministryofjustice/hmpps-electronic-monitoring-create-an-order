import { z } from 'zod'

const MonitoringConditionsModel = z.object({
  startDate: z.string().datetime().nullable(),
  startTime: z.string().nullable().optional(),
  endDate: z.string().datetime().nullable(),
  endTime: z.string().nullable().optional(),
  orderType: z.string().nullable(),
  curfew: z.boolean().nullable(),
  exclusionZone: z.boolean().nullable(),
  trail: z.boolean().nullable(),
  mandatoryAttendance: z.boolean().nullable(),
  alcohol: z.boolean().nullable(),
  conditionType: z.string().nullable(),
  orderTypeDescription: z.string().nullable(),
  isValid: z.boolean().default(false),
})

export type MonitoringConditions = z.infer<typeof MonitoringConditionsModel>

export default MonitoringConditionsModel
