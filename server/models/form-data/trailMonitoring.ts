import { z } from 'zod'

const TrailMonitoringFormDataModel = z.object({
  action: z.string().default('continue'),
  'startDate-day': z.string(),
  'startDate-month': z.string(),
  'startDate-year': z.string(),
  'endDate-day': z.string(),
  'endDate-month': z.string(),
  'endDate-year': z.string(),
})

export type TrailMonitoringFormData = z.infer<typeof TrailMonitoringFormDataModel>

export default TrailMonitoringFormDataModel
