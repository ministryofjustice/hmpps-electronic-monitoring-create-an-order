import { Order } from '../Order'
import { ViewModel, TextField } from './utils'
import { Address, AddressTypeEnum } from '../Address'
import { InstallationLocation } from '../InstallationLocation'

type InstallationLocationViewModel = ViewModel<InstallationLocation> & {
  primaryAddressView: TextField
  showTagAtSourceOptions: boolean
}

const createPrimaryAddressView = (addresses: Address[]): string => {
  const primaryAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.PRIMARY)
  return primaryAddress
    ? `${primaryAddress.addressLine1}, ${primaryAddress.addressLine2}, ${primaryAddress.postcode}`
    : ''
}

const construct = (order: Order): InstallationLocationViewModel => {
  let showTagAtSourceOptions = false
  if (
    order.monitoringConditions.alcohol === true &&
    order.monitoringConditions.curfew === false &&
    order.monitoringConditions.exclusionZone === false &&
    order.monitoringConditions.mandatoryAttendance === false &&
    order.monitoringConditions.trail === false
  ) {
    showTagAtSourceOptions = true
  }
  return {
    location: {
      value: order.installationLocation!.location ?? '',
    },
    primaryAddressView: { value: createPrimaryAddressView(order.addresses) },
    errorSummary: null,
    showTagAtSourceOptions,
  }
}

export default {
  construct,
}
