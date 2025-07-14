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
    .transform(val => (val === null ? 'UNKNOWN' : val)),
  hdc: z
    .string()
    .nullable()
    .default(null)
    .transform(val => (val === null ? 'UNKNOWN' : val)),
  prarr: z
    .string()
    .nullable()
    .default(null)
    .transform(val => (val === null ? 'UNKNOWN' : val)),
  pilot: z.coerce.string().nullable().default(''),
  dataDictionaryVersion: z.string().optional(),
})

type MonitoringConditionsFormData = Omit<z.infer<typeof MonitoringConditionsFormDataParser>, 'action'>

const validateMonitoringConditionsFormData = (formData: MonitoringConditionsFormData) => {
  const { dataDictionaryVersion } = formData
  return z
    .object({
      orderType: z.string().min(1, validationErrors.monitoringConditions.orderTypeRequired),
      monitoringRequired: z.array(z.string()).min(1, validationErrors.monitoringConditions.monitoringTypeRequired),
      orderTypeDescription: z.string().refine(val => val !== 'undefined' || dataDictionaryVersion !== 'DDV4', {
        message: validationErrors.monitoringConditions.orderTypeDescriptionRequired,
      }),
      conditionType: z.string().min(1, validationErrors.monitoringConditions.conditionTypeRequired),
      startDate: DateTimeInputModel(validationErrors.monitoringConditions.startDateTime),
      endDate: DateTimeInputModel(validationErrors.monitoringConditions.endDateTime),
      sentenceType: z.string({ message: validationErrors.monitoringConditions.sentenceTypeRequired }),
      issp: z.string(),
      hdc: z.string(),
      prarr: z.string(),
      pilot: z.string().nullable(),
    })
    .transform(({ monitoringRequired, orderType, orderTypeDescription, pilot, ...data }) => ({
      orderType: orderType === '' ? null : orderType,
      orderTypeDescription: orderTypeDescription === 'undefined' || '' ? null : orderTypeDescription,
      curfew: monitoringRequired.includes('curfew'),
      exclusionZone: monitoringRequired.includes('exclusionZone'),
      trail: monitoringRequired.includes('trail'),
      mandatoryAttendance: monitoringRequired.includes('mandatoryAttendance'),
      alcohol: monitoringRequired.includes('alcohol'),
      pilot: pilot === '' ? null : pilot,
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
