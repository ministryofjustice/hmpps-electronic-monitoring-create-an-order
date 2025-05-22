import { z } from 'zod'
import { DateTimeInputModel } from './formData'
import { validationErrors } from '../../constants/validationErrors'
import  {  
  AlcoholMonitoringType,
  InstallationLocationType,
} from '../AlcoholMonitoring'

const AlcoholMonitoringFormDataModel = z.object({
  action: z.string().default('continue'),
  monitoringType: z.string().nullable().default(null),
  startDate: z.object({
    day: z.string().default(''),
    month: z.string().default(''),
    year: z.string().default(''),
    hours: z.string().default(''),
    minutes: z.string().default(''),
  }),
  endDate:z.object({
    day: z.string().default(''),
    month: z.string().default(''),
    year: z.string().default(''),
    hours: z.string().default(''),
    minutes: z.string().default(''),
  }),  
  installationLocation: z.string().nullable().default(null),
  prisonName: z.string().nullable().default(null),
  probationOfficeName: z.string().nullable().default(null),
})

export type AlcoholMonitoringFormData = z.infer<typeof AlcoholMonitoringFormDataModel>

const AlcoholMonitoringFormDataValidator = z
  .object({
    monitoringType: z.string(),
    startDate: DateTimeInputModel(validationErrors.monitoringConditionsAlcohol.startDateTime),
    endDate: DateTimeInputModel(validationErrors.monitoringConditionsAlcohol.endDateTime),
    installationLocation: z.string(),
    prisonName:z.string(),
    probationOfficeName: z.string()
  })
  .transform(({ monitoringType, installationLocation, probationOfficeName,prisonName, ...formData }) => ({
    monitoringType: (monitoringType as AlcoholMonitoringType) ?? null,
    installationLocation: (installationLocation as InstallationLocationType) ?? null,
    probationOfficeName: probationOfficeName || null,
    prisonName: prisonName || null,
    ...formData,
  }))

  type AlcoholMonitoringApiRequestBody = z.infer<typeof AlcoholMonitoringFormDataValidator>

export { 
  AlcoholMonitoringFormDataModel,
  AlcoholMonitoringApiRequestBody,
  AlcoholMonitoringFormDataValidator
}

