import { z } from 'zod'
import { DateTimeInputModel } from './formData'
import { validationErrors } from '../../constants/validationErrors'

const MonitoringConditionsFormDataParser = z.object({
  action: z.string().default('continue'),
  orderType: z.coerce.string(),
  monitoringRequired: z
    .union([z.string(), z.array(z.string()).default([])])
    .transform(val => (Array.isArray(val) ? val : [val])),
  orderTypeDescription: z.coerce.string(),
  conditionType: z
    .string()
    .nullable()
    .default(null)
    .transform(val => (val === null ? '' : val)),
  startDate: z.object({
    day: z.string().default(''),
    month: z.string().default(''),
    year: z.string().default(''),
    hours: z.string().default(''),
    minutes: z.string().default(''),
  }),
  endDate: z.object({
    day: z.string().default(''),
    month: z.string().default(''),
    year: z.string().default(''),
    hours: z.string().default(''),
    minutes: z.string().default(''),
  }),
  sentenceType: z
    .string()
    .nullable()
    .default(null)
    .transform(val => (val === '' ? null : val)),
  issp: z
    .string()
    .nullable()
    .default(null)
    .transform(val => (val === '' ? null : val)),
  hdc: z
    .string()
    .nullable()
    .default(null)
    .transform(val => (val === '' ? null : val)),
  prarr: z
    .string()
    .nullable()
    .default(null)
    .transform(val => (val === '' ? null : val)),
  pilot: z.coerce.string().nullable().default(''),
  dataDictionaryVersion: z.string().optional(),
})

type MonitoringConditionsFormData = Omit<z.infer<typeof MonitoringConditionsFormDataParser>, 'action'>
const getConditionTypeFromOrderType = (orderType: string): string => {
  if (orderType === 'POST_RELEASE') return 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER'
  if (orderType === 'COMMUNITY') return 'REQUIREMENT_OF_A_COMMUNITY_ORDER'
  return ''
}
const validateMonitoringConditionsFormData = (formData: MonitoringConditionsFormData) => {
  const { dataDictionaryVersion } = formData
  return z
    .object({
      orderType: z.string().min(1, validationErrors.monitoringConditions.orderTypeRequired),
      orderTypeDescription: z.string().refine(val => val !== 'undefined' || dataDictionaryVersion !== 'DDV4', {
        message: validationErrors.monitoringConditions.orderTypeDescriptionRequired,
      }),
      startDate: DateTimeInputModel(validationErrors.monitoringConditions.startDateTime),
      endDate: DateTimeInputModel(validationErrors.monitoringConditions.endDateTime),
      pilot: z.string().refine(val => val.length >= 1 || dataDictionaryVersion !== 'DDV5', {
        message: validationErrors.monitoringConditions.pilotRequired,
      }),
      sentenceType: z.string({ message: validationErrors.monitoringConditions.sentenceTypeRequired }),
      issp: z.string({ message: validationErrors.monitoringConditions.isspRequired }),
      hdc: z.string({ message: validationErrors.monitoringConditions.hdcRequired }),
      prarr: z.string({ message: validationErrors.monitoringConditions.prarrRequired }),
      monitoringRequired: z.array(z.string()).min(1, validationErrors.monitoringConditions.monitoringTypeRequired),
    })
    .transform(({ monitoringRequired, orderType, orderTypeDescription, pilot, ...data }) => ({
      orderType: orderType === '' ? null : orderType,
      orderTypeDescription:
        orderTypeDescription === 'undefined' || orderTypeDescription === '' ? null : orderTypeDescription,
      curfew: monitoringRequired.includes('curfew'),
      exclusionZone: monitoringRequired.includes('exclusionZone'),
      trail: monitoringRequired.includes('trail'),
      mandatoryAttendance: monitoringRequired.includes('mandatoryAttendance'),
      alcohol: monitoringRequired.includes('alcohol'),
      pilot: pilot === '' ? null : pilot,
      conditionType: getConditionTypeFromOrderType(orderType),
      ...data,
    }))
    .parse(formData)
}

type MonitoringConditionsApiRequestBody = ReturnType<typeof validateMonitoringConditionsFormData>

export {
  MonitoringConditionsFormData,
  MonitoringConditionsFormDataParser,
  MonitoringConditionsApiRequestBody,
  validateMonitoringConditionsFormData,
}
