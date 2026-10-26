import { isNullOrUndefined } from '../values'
import { AddressWithoutType } from '../../models/Address'
import ReferenceData from '../../types/i18n/reference/reference'

export const lookup = (map: ReferenceData, value: string | null | undefined, defaultValue: string = ''): string => {
  if (isNullOrUndefined(value)) {
    return defaultValue
  }

  if (Object.keys(map).includes(value)) {
    if (typeof map[value] === 'object') {
      return map[value].text
    }
    return map[value]
  }

  return defaultValue
}

export const createAddressPreview = (address: AddressWithoutType | null | undefined): string => {
  if (isNullOrUndefined(address)) {
    return ''
  }
  const separator = ', '
  let addressString = address.addressLine1
  if (address.addressLine2) {
    addressString += separator + address.addressLine2
  }
  addressString += separator + address.addressLine3
  if (address.addressLine4) {
    addressString += separator + address.addressLine4
  }
  return addressString + separator + address.postcode
}
