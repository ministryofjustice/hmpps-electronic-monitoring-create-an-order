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
})

type MonitoringConditionsFormData = Omit<z.infer<typeof MonitoringConditionsFormDataParser>, 'action'>

const MonitoringConditionsFormDataValidator = z
  .object({
    orderType: z.string().min(1, validationErrors.monitoringConditions.orderTypeRequired),
    monitoringRequired: z.array(z.string()).min(1, validationErrors.monitoringConditions.monitoringTypeRequired),
    orderTypeDescription: z.string(),
    conditionType: z.string().min(1, validationErrors.monitoringConditions.conditionTypeRequired),
    startDate: DateTimeInputModel(validationErrors.monitoringConditions.startDateTime),
    endDate: DateTimeInputModel(validationErrors.monitoringConditions.endDateTime),
    sentenceType: z.string().nullable(),
    issp: z.string(),
    hdc: z.string(),
    prarr: z.string(),
  })
  .transform(({ monitoringRequired, orderType, orderTypeDescription, ...formData }) => ({
    orderType: orderType === '' ? null : orderType,
    orderTypeDescription: orderTypeDescription === '' ? null : orderTypeDescription,
    curfew: monitoringRequired.includes('curfew'),
    exclusionZone: monitoringRequired.includes('exclusionZone'),
    trail: monitoringRequired.includes('trail'),
    mandatoryAttendance: monitoringRequired.includes('mandatoryAttendance'),
    alcohol: monitoringRequired.includes('alcohol'),
    ...formData,
  }))

type MonitoringConditionsApiRequestBody = z.infer<typeof MonitoringConditionsFormDataValidator>

export {
  MonitoringConditionsFormData,
  MonitoringConditionsFormDataParser,
  MonitoringConditionsApiRequestBody,
  MonitoringConditionsFormDataValidator,
}
