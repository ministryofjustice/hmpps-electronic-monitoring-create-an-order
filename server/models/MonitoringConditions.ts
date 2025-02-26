import { z } from 'zod'
import { YesNoUnknownEnum } from './YesNoUnknown'

export const OrderTypeEnum = z.enum(['CIVIL', 'COMMUNITY', 'IMMIGRATION', 'POST_RELEASE', 'PRE_TRIAL', 'SPECIAL'])

export const SentenceTypeEnum = z.enum([
  'EXTENDED_DETERMINATE_SENTENCE',
  'IPP',
  'LIFE_SENTENCE',
  'SOPC',
  'EPP',
  'SECTION_85_EXTENDED_SENTENCES',
  'STANDARD_DETERMINATE_SENTENCE',
])

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
  sentenceType: SentenceTypeEnum.nullable(),
  issp: YesNoUnknownEnum.nullable(),
  hdc: YesNoUnknownEnum.nullable(),
  prarr: YesNoUnknownEnum.nullable(),
  isValid: z.boolean().default(false),
})

export type MonitoringConditions = z.infer<typeof MonitoringConditionsModel>

export default MonitoringConditionsModel
