import { z } from 'zod'

export const OrderTypeEnum = z.enum(['CIVIL', 'COMMUNITY', 'IMMIGRATION', 'POST_RELEASE', 'PRE_TRIAL', 'SPECIAL'])

const MonitoringConditionsModel = z.object({
  startDate: z.string().datetime().nullable(),
  endDate: z.string().datetime().nullable(),
  orderType: OrderTypeEnum.nullable(),
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
