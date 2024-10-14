import { z } from 'zod'

const AttendanceMonitoringModel = z.object({
  id: z.string().optional(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  purpose: z.string().nullable(),
  appointmentDay: z.string().nullable(),
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),
  addressLine1: z.string().nullable(),
  addressLine2: z.string().nullable(),
  addressLine3: z.string().nullable(),
  addressLine4: z.string().nullable(),
  postcode: z.string().nullable(),
})

export type AttendanceMonitoring = z.infer<typeof AttendanceMonitoringModel>

export default AttendanceMonitoringModel
