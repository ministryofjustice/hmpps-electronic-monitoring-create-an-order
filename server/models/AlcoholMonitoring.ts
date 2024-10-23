import { z } from 'zod'

export const AlcoholMonitoringTypeEnum = z.enum(['ALCOHOL_LEVEL', 'ALCOHOL_ABSTINENCE']).nullable()
export const InstallationLocationEnum = z
  .enum(['PRIMARY', 'SECONDARY', 'TERTIARY', 'INSTALLATION', 'PRISON', 'PROBATION_OFFICE'])
  .nullable()

const AlcoholMonitoringModel = z.object({
  monitoringType: AlcoholMonitoringTypeEnum,
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  installationLocation: InstallationLocationEnum,
  prisonName: z.string().nullable(),
  probationOfficeName: z.string().nullable(),
})

export type AlcoholMonitoring = z.infer<typeof AlcoholMonitoringModel>
export type InstallationLocationType = z.infer<typeof InstallationLocationEnum>
export type AlcoholMonitoringType = z.infer<typeof AlcoholMonitoringTypeEnum>

export default AlcoholMonitoringModel
