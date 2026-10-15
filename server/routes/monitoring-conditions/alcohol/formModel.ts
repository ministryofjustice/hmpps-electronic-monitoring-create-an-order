import { z } from 'zod'
import { DateTimeInputModel } from '../../../models/form-data/formData'
import { validationErrors } from '../../../constants/validationErrors'
import { AlcoholMonitoringType } from '../../../models/AlcoholMonitoring'

const AlcoholMonitoringFormDataModel = z.object({
  action: z.string().default('continue'),
  monitoringType: z.string().default(''),
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

export type AlcoholMonitoringFormData = z.infer<typeof AlcoholMonitoringFormDataModel>

const AlcoholMonitoringFormDataValidator = z
  .object({
    monitoringType: z.string().min(1, validationErrors.monitoringConditionsAlcohol.monitoringTypeRequired),
    startDate: DateTimeInputModel(validationErrors.monitoringConditionsAlcohol.startDateTime),
    endDate: DateTimeInputModel(validationErrors.monitoringConditionsAlcohol.endDateTime),
  })
  .transform(({ monitoringType, ...formData }) => ({
    monitoringType: (monitoringType as AlcoholMonitoringType) ?? null,
    ...formData,
  }))

type AlcoholMonitoringApiRequestBody = z.infer<typeof AlcoholMonitoringFormDataValidator>

export { AlcoholMonitoringFormDataModel, AlcoholMonitoringApiRequestBody, AlcoholMonitoringFormDataValidator }
