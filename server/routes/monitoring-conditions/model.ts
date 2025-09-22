import z from 'zod'

export const OrderTypeEnum = z.enum(['CIVIL', 'COMMUNITY', 'IMMIGRATION', 'POST_RELEASE', 'PRE_TRIAL', 'SPECIAL'])

const MonitoringConditionsModel = z.object({
  orderType: OrderTypeEnum.nullable().optional(),
})

export type MonitoringConditions = z.infer<typeof MonitoringConditionsModel>

export default MonitoringConditionsModel
