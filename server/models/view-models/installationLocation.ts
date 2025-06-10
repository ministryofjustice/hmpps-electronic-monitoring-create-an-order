import { Order } from '../Order'
import { ViewModel, TextField } from './utils'
import { Address, AddressTypeEnum } from '../Address'

type InstallationLocationViewModel = ViewModel<object> & {
  primaryAddressView: TextField
}

const createPrimaryAddressView = (addresses: Address[]): string => {
  const primaryAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.PRIMARY)
  return primaryAddress
    ? `${primaryAddress.addressLine1}, ${primaryAddress.addressLine2}, ${primaryAddress.postcode}`
    : ''
}

const construct = (order: Order): InstallationLocationViewModel => {
  return {
    primaryAddressView: { value: createPrimaryAddressView(order.addresses) },
    errorSummary: null,
  }
}

export default {
  construct,
}
