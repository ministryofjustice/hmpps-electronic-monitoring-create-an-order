import z from 'zod'

export const OrderTypeEnum = z.enum(['CIVIL', 'COMMUNITY', 'IMMIGRATION', 'POST_RELEASE', 'BAIL'])
export const OrderTypeConditionsEnum = z.enum([
  'LICENCE_CONDITIONS_OF_A_CUSTODIAL_ORDER',
  'REQUIREMENTS_OF_A_COMMUNITY_ORDER',
  'BAIL_ORDER',
])

const MonitoringConditionsModel = z.object({
  orderType: OrderTypeEnum.nullable().optional(),
  orderTypeConditions: OrderTypeConditionsEnum.nullable().optional(),
})

export type MonitoringConditions = z.infer<typeof MonitoringConditionsModel>

export default MonitoringConditionsModel
