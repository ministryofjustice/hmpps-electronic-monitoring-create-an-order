import { z } from 'zod'
import { DateTimeInputModel } from './formData'
import { validationErrors } from '../../constants/validationErrors'
import { serialiseTime } from '../../utils/utils'

const AttendanceMonitoringFormDataModel = z.object({
  action: z.string().default('continue'),
  id: z.string().nullable().default(null),
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
  purpose: z.string(),
  appointmentDay: z.string(),
  startTimeHours: z.string(),
  startTimeMinutes: z.string(),
  endTimeHours: z.string(),
  endTimeMinutes: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  addressLine3: z.string(),
  addressLine4: z.string(),
  postcode: z.string(),
  addAnother: z.string().default('false'),
})

type AttendanceMonitoringFormData = z.infer<typeof AttendanceMonitoringFormDataModel>

export default AttendanceMonitoringFormDataModel

const AttendanceMonitoringFormDataValidator = z
  .object({
    id: z.string().nullable(),
    startDate: DateTimeInputModel(validationErrors.mandatoryAttendanceConditions.startDateTime),
    endDate: DateTimeInputModel(validationErrors.mandatoryAttendanceConditions.endDateTime),
    purpose: z.string().min(1, validationErrors.mandatoryAttendanceConditions.purposeRequired),
    appointmentDay: z.string().min(1, validationErrors.mandatoryAttendanceConditions.appointmentDayRequired),
    addressLine1: z.string(),
    addressLine2: z.string(),
    addressLine3: z.string(),
    addressLine4: z.string(),
    postcode: z.string(),
    startTimeHours: z.string(),
    startTimeMinutes: z.string(),
    endTimeHours: z.string(),
    endTimeMinutes: z.string(),
  })
  .transform(({ startTimeHours, startTimeMinutes, endTimeHours, endTimeMinutes, postcode, ...formData }) => ({
    startTime: serialiseTime(startTimeHours, startTimeMinutes),
    endTime: serialiseTime(endTimeHours, endTimeMinutes),
    postcode: postcode === '' ? null : postcode,
    ...formData,
  }))

type AttendanceMonitoringApiRequestBody = z.infer<typeof AttendanceMonitoringFormDataValidator>

export {
  AttendanceMonitoringFormDataModel,
  AttendanceMonitoringApiRequestBody,
  AttendanceMonitoringFormDataValidator,
  AttendanceMonitoringFormData,
}
