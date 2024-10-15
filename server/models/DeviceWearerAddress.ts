import { z } from 'zod'
import AddressModel from './Address'

export const DeviceWearerAddressTypeEnum = z.enum([
  'PRIMARY',
  'SECONDARY',
  'TERTIARY',
  'NO_FIXED_ABODE',
  'INSTALLATION',
])

const DeviceWearerAddressModel = z.object({
  addressType: DeviceWearerAddressTypeEnum,
  installationAddress: z.boolean(),
  address: AddressModel.nullable(),
})

export type DeviceWearerAddress = z.infer<typeof DeviceWearerAddressModel>
export type DeviceWearerAddressType = z.infer<typeof DeviceWearerAddressTypeEnum>

export default DeviceWearerAddressModel
