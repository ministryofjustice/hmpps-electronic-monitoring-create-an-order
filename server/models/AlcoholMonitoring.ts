import { z } from 'zod'

const AlcoholMonitoringModel = z.object({
  monitoringType: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  installationLocation: z.string().nullable(),
  agreedAddressLine1: z.string().nullable(),
  agreedAddressLine2: z.string().nullable(),
  agreedAddressLine3: z.string().nullable(),
  agreedAddressLine4: z.string().nullable(),
  agreedAddressPostcode: z.string().nullable(),
  probationName: z.string().nullable(),
  prisonName: z.string().nullable(),
})

export type AlcoholMonitoring = z.infer<typeof AlcoholMonitoringModel>

export default AlcoholMonitoringModel
