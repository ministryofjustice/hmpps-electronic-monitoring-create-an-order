import { z } from 'zod'
import AddressModel from './Address'

export const DeviceWearerAddressTypeEnum = z.enum(['PRIMARY', 'SECONDARY', 'TERTIARY'])

const DeviceWearerAddressModel = z.object({
  addressType: DeviceWearerAddressTypeEnum,
  address: AddressModel
})

export type DeviceWearerAddress = z.infer<typeof DeviceWearerAddressModel>
export type DeviceWearerAddressType = z.infer<typeof DeviceWearerAddressTypeEnum>

export default DeviceWearerAddressModel
