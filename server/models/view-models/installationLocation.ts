import { Order } from '../Order'
import { ViewModel, TextField } from './utils'
import { Address, AddressTypeEnum, AddressWithoutType } from '../Address'
import { InstallationLocation } from '../InstallationLocation'
import { InstallationLocationFormData } from '../form-data/installationLocation'
import { ValidationResult } from '../Validation'
import { createGovukErrorSummary } from '../../utils/errors'
import { getError, isNullOrUndefined } from '../../utils/utils'

type InstallationLocationViewModel = ViewModel<InstallationLocation> & {
  primaryAddressView: TextField
}

export const createAddress = (address: AddressWithoutType | null | undefined): string => {
  if (isNullOrUndefined(address)) {
    return ''
  }
  const separator = ', '
  let addressString = address.addressLine1
  if (address.addressLine2) {
    addressString += separator + address.addressLine2
  }
  if (address.addressLine4) {
    addressString += separator + address.addressLine4
  }
  return addressString + separator + address.postcode
}

const createPrimaryAddressView = (addresses: Address[]): string => {
  const primaryAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.PRIMARY)
  return primaryAddress ? `${createAddress(primaryAddress)}` : ''
}

const constructFromFormData = (
  formData: InstallationLocationFormData,
  primaryAddressView: string,
  validationErrors: ValidationResult,
): InstallationLocationViewModel => {
  return {
    location: {
      value: formData.location || '',
      error: getError(validationErrors, 'location'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
    primaryAddressView: { value: primaryAddressView },
  }
}

const constructFromEntity = (primaryAddressView: string, location: string = ''): InstallationLocationViewModel => {
  return {
    location: {
      value: location ?? '',
    },
    primaryAddressView: { value: primaryAddressView },
    errorSummary: null,
  }
}

const construct = (
  order: Order,
  formData: InstallationLocationFormData,
  validationErrors: ValidationResult,
): InstallationLocationViewModel => {
  const primaryAddressView = createPrimaryAddressView(order.addresses)

  if (validationErrors.length > 0) {
    return constructFromFormData(formData, primaryAddressView, validationErrors)
  }
  return constructFromEntity(primaryAddressView, order.installationLocation?.location)
}

export default {
  construct,
}
