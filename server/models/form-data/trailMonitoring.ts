import { z } from 'zod'
import { DateTimeInputModel } from './formData'
import { validationErrors } from '../../constants/validationErrors'
import { NotifyingOrganisation } from '../NotifyingOrganisation'

const TrailMonitoringFormDataModel = z.object({
  action: z.string().default('continue'),
  startDate: z.object({
    day: z.string().default(''),
    month: z.string().default(''),
    year: z.string().default(''),
    hours: z.string().default(''),
    minutes: z.string().default(''),
  }),
  endDate: z
    .object({
      day: z.string().default(''),
      month: z.string().default(''),
      year: z.string().default(''),
      hours: z.string().default(''),
      minutes: z.string().default(''),
    })
    .optional(),
  deviceType: z.string().optional(),
})

const TrailMonitoringFormDataValidator = (notifyingOrganisation: NotifyingOrganisation | null) =>
  z.object({
    startDate: DateTimeInputModel(validationErrors.trailMonitoring.startDateTime),
    endDate:
      notifyingOrganisation !== 'HOME_OFFICE'
        ? DateTimeInputModel(validationErrors.trailMonitoring.endDateTime)
        : z.any().optional(),
    deviceType:
      notifyingOrganisation === 'HOME_OFFICE'
        ? z.string({ message: validationErrors.trailMonitoringHomeOffice.deviceTypeRequired })
        : z.string().optional(),
  })

type TrailMonitoringApiRequestBody = z.infer<ReturnType<typeof TrailMonitoringFormDataValidator>>

export { TrailMonitoringFormDataModel, TrailMonitoringApiRequestBody, TrailMonitoringFormDataValidator }
export type TrailMonitoringFormData = z.infer<typeof TrailMonitoringFormDataModel>

export default TrailMonitoringFormDataModel
