import { z } from 'zod'

const AttendanceMonitoringModel = z.object({})

export type AttendanceMonitoring = z.infer<typeof AttendanceMonitoringModel>

export default AttendanceMonitoringModel
