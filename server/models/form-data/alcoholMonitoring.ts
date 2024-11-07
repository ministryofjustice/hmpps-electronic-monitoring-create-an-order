import { z } from 'zod'

const AlcoholMonitoringFormDataModel = z.object({
  action: z.string().default('continue'),
  monitoringType: z.string().nullable().default(null),
  'startDate-day': z.string(),
  'startDate-month': z.string(),
  'startDate-year': z.string(),
  'endDate-day': z.string(),
  'endDate-month': z.string(),
  'endDate-year': z.string(),
  installationLocation: z.string().nullable().default(null),
  prisonName: z.string().nullable().default(null),
  probationOfficeName: z.string().nullable().default(null),
})

export type AlcoholMonitoringFormData = z.infer<typeof AlcoholMonitoringFormDataModel>

export default AlcoholMonitoringFormDataModel
