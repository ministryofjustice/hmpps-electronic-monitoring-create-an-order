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
    orderType: z.string().min(1, 'Order type is required'),
    monitoringRequired: z.array(z.string()).min(1, 'At least one monitoring type must be selected'),
    orderTypeDescription: z.string(),
    conditionType: z.string().min(1, 'Condition type is required'),
    startDate: DateTimeInputModel.pipe(z.string({ message: 'Order start date and time are required' }).datetime()),
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
