import z from 'zod'

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
export const PilotTypeEnum = z.enum([
  'ACQUISITIVE_CRIME_PROJECT',
  'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_PROJECT',
  'LICENCE_VARIATION_PROJECT',
  'DOMESTIC_ABUSE_PROTECTION_ORDER',
  'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_DAPOL',
  'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_HOME_DETENTION_CURFEW_DAPOL_HDC',
  'GPS_ACQUISITIVE_CRIME_HOME_DETENTION_CURFEW',
  'GPS_ACQUISITIVE_CRIME_PAROLE',
  'UNKNOWN',
])
export const MonitoringTypesEnum = z.enum(['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance', 'alcohol'])

const MonitoringConditionsModel = z.object({
  orderType: OrderTypeEnum.nullable().optional(),
  conditionType: ConditionTypeEnum.nullable().optional(),
  sentenceType: SentenceTypeEnum.nullable().optional(),
  curfew: z.boolean().nullable().optional(),
  exclusionZone: z.boolean().nullable().optional(),
  trail: z.boolean().nullable().optional(),
  mandatoryAttendance: z.boolean().nullable().optional(),
  alcohol: z.boolean().nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  hdc: z.string().nullable().optional(),
  pilot: PilotTypeEnum.nullable().optional(),
  dapolMissedInError: z.string().nullable().optional(),
  offenceType: z.string().nullable().optional(),
  issp: z.string().nullable().optional(),
  prarr: YesNoUnknownEnum.nullable().optional(),
  policeArea: z.string().nullable().optional(),
})

export type MonitoringConditions = z.infer<typeof MonitoringConditionsModel>

export default MonitoringConditionsModel
