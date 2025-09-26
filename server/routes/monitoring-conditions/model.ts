import z from 'zod'
import { DateTimeInputModel } from '../../models/form-data/formData'
import { validationErrors } from '../../constants/validationErrors'

export const OrderTypeEnum = z.enum(['CIVIL', 'COMMUNITY', 'IMMIGRATION', 'POST_RELEASE', 'BAIL'])
export const ConditionTypeEnum = z.enum([
  'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
  'REQUIREMENT_OF_A_COMMUNITY_ORDER',
  'BAIL_ORDER',
])

const MonitoringConditionsModel = z.object({
  orderType: OrderTypeEnum.nullable().optional(),
  conditionType: ConditionTypeEnum.nullable().optional(),
  curfew: z.boolean().nullable().optional(),
  exclusionZone: z.boolean().nullable().optional(),
  trail: z.boolean().nullable().optional(),
  mandatoryAttendance: z.boolean().nullable().optional(),
  alcohol: z.boolean().nullable().optional(),
  startDate: DateTimeInputModel(validationErrors.monitoringConditions.startDateTime).nullable().optional(),
  endDate: DateTimeInputModel(validationErrors.monitoringConditions.endDateTime).nullable().optional(),
})

export type MonitoringConditions = z.infer<typeof MonitoringConditionsModel>

export default MonitoringConditionsModel
