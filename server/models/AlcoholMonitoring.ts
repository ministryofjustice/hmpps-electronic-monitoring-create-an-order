import { z } from 'zod'
import { AddressTypeEnum } from './Address'

export const InstallationAddressTypeEnum = z.enum(['PRIMARY', 'SECONDARY', 'TERTIARY', 'INSTALLATION'])
export const AlcoholMonitoringTypeEnum = z.enum(['ALCOHOL_LEVEL', 'ABSTINENCE'])

const AlcoholMonitoringModel = z.object({
  monitoringType: AlcoholMonitoringTypeEnum.nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  installationAddressType: InstallationAddressTypeEnum.nullable(),
  prisonName: z.string().nullable(),
  probationOfficeName: z.string().nullable(),
})

export type AlcoholMonitoring = z.infer<typeof AlcoholMonitoringModel>

export default AlcoholMonitoringModel
