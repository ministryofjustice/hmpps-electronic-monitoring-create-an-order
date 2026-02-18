import z from 'zod'

export const deviceTypes = ['FITTED', 'NON_FITTED'] as const

export const DeviceTypeEnum = z.enum(deviceTypes)

export type DeviceType = z.infer<typeof DeviceTypeEnum>
