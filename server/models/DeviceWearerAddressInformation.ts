import { z } from 'zod'
import AddressModel from './Address'

export const DeviceWearerAddressTypeEnum = z.enum(['PRIMARY', 'SECONDARY', 'TERTIARY'])

const DeviceWearerAddressInformationModel = z.object({
  primaryAddress: AddressModel.nullable(),
  secondaryAddress: AddressModel.nullable(),
  tertiaryAddress: AddressModel.nullable()
})

export type DeviceWearerAddressInformation = z.infer<typeof DeviceWearerAddressInformationModel>
export type DeviceWearerAddressType = z.infer<typeof DeviceWearerAddressTypeEnum>

export default DeviceWearerAddressInformationModel
