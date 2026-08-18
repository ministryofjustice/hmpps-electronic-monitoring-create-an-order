import z from 'zod'

const deviceTypes = ['FITTED', 'NON_FITTED'] as const

export const DeviceTypeEnum = z.enum(deviceTypes)

export default DeviceTypeEnum
