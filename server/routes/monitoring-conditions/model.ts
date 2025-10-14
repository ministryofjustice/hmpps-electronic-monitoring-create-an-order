import z from 'zod'
import { DateTimeInputModel } from '../../models/form-data/formData'
import { validationErrors } from '../../constants/validationErrors'

export const OrderTypeEnum = z.enum(['CIVIL', 'COMMUNITY', 'IMMIGRATION', 'POST_RELEASE', 'BAIL'])
export const ConditionTypeEnum = z.enum([
  'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
  'REQUIREMENT_OF_A_COMMUNITY_ORDER',
  'BAIL_ORDER',
])
export const SentenceTypeEnum = z.enum([
  'STANDARD_DETERMINATE_SENTENCE',
  'EXTENDED_DETERMINATE_SENTENCE',
  'IPP',
  'LIFE_SENTENCE',
  'SOPC',
  'EPP',
  'SECTION_85_EXTENDED_SENTENCES',
  'SECTION_91',
  'DTO',
  'COMMUNITY_YRO',
  'COMMUNITY_SDO',
  'COMMUNITY_SUSPENDED_SENTENCE',
  'COMMUNITY',
  'BAIL_SUPERVISION_SUPPORT',
  'BAIL_RLAA',
  'BAIL',
])

export const YesNoUnknownEnum = z.enum(['YES', 'NO', 'UNKNOWN'])

const MonitoringConditionsModel = z.object({
  orderType: OrderTypeEnum.nullable().optional(),
  conditionType: ConditionTypeEnum.nullable().optional(),
  sentenceType: SentenceTypeEnum.nullable().optional(),
  curfew: z.boolean().nullable().optional(),
  exclusionZone: z.boolean().nullable().optional(),
  trail: z.boolean().nullable().optional(),
  mandatoryAttendance: z.boolean().nullable().optional(),
  alcohol: z.boolean().nullable().optional(),
  startDate: DateTimeInputModel(validationErrors.monitoringConditions.startDateTime).nullable().optional(),
  endDate: DateTimeInputModel(validationErrors.monitoringConditions.endDateTime).nullable().optional(),
  hdc: z.string().nullable().optional(),
})

export type MonitoringConditions = z.infer<typeof MonitoringConditionsModel>

export default MonitoringConditionsModel
