import { z } from 'zod'
import { DateTimeInputModel } from './formData'
import { validationErrors } from '../../constants/validationErrors'

const TrailMonitoringFormDataModel = z.object({
  action: z.string().default('continue'),
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
  deviceType: z.string().optional(),
})

const TrailMonitoringFormDataValidator = z.object({
  startDate: DateTimeInputModel(validationErrors.trailMonitoring.startDateTime),
  endDate: DateTimeInputModel(validationErrors.trailMonitoring.endDateTime),
})
type TrailMonitoringApiRequestBody = z.infer<typeof TrailMonitoringFormDataValidator>

export { TrailMonitoringFormDataModel, TrailMonitoringApiRequestBody, TrailMonitoringFormDataValidator }
export type TrailMonitoringFormData = z.infer<typeof TrailMonitoringFormDataModel>

export default TrailMonitoringFormDataModel
