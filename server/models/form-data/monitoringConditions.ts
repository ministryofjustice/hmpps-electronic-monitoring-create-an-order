import { z } from 'zod'
import { DateTimeInputModel } from './formData'

const MonitoringConditionsFormDataParser = z.object({
  action: z.string().default('continue'),
  orderType: z.coerce.string(),
  monitoringRequired: z
    .union([z.string(), z.array(z.string()).default([])])
    .transform(val => (Array.isArray(val) ? val : [val])),
  orderTypeDescription: z.coerce.string(),
  conditionType: z.coerce.string(),
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
})

type MonitoringConditionsFormData = Omit<z.infer<typeof MonitoringConditionsFormDataParser>, 'action'>

const MonitoringConditionsFormDataValidator = z
  .object({
    action: z.string().default('continue'),
    orderType: z.string(),
    monitoringRequired: z.array(z.string()),
    orderTypeDescription: z.string(),
    conditionType: z.string(),
    startDate: DateTimeInputModel.pipe(z.string({ message: 'Order start date is required' }).datetime()),
    endDate: DateTimeInputModel,
  })
  .transform(({ monitoringRequired, orderType, orderTypeDescription, conditionType, ...formData }) => ({
    orderType: orderType === '' ? null : orderType,
    orderTypeDescription: orderTypeDescription === '' ? null : orderTypeDescription,
    conditionType: conditionType === '' ? null : conditionType,
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
