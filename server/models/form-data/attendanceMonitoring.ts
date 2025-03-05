import { z } from 'zod'

const AttendanceMonitoringFormDataModel = z.object({
  action: z.string().default('continue'),
  'startDate-day': z.string(),
  'startDate-month': z.string(),
  'startDate-year': z.string(),
  'endDate-day': z.string(),
  'endDate-month': z.string(),
  'endDate-year': z.string(),
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
  addressPostcode: z.string(),
  addAnother: z.string().default('false'),
})

type AttendanceMonitoringFormData = z.infer<typeof AttendanceMonitoringFormDataModel>

export default AttendanceMonitoringFormDataModel

export { AttendanceMonitoringFormData }
