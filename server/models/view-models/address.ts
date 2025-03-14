import { createGovukErrorSummary } from '../../utils/errors'
import { getError } from '../../utils/utils'
import { Address, AddressType, AddressTypeEnum } from '../Address'
import { AddressFormData } from '../form-data/address'
import { ValidationResult } from '../Validation'
import { ViewModel } from './utils'

type AddressViewModel = ViewModel<
  Address & {
    hasAnotherAddress: boolean
  }
>

const constructFromFormData = (
  addressType: string,
  formData: AddressFormData,
  validationErrors: ValidationResult,
): AddressViewModel => {
  return {
    addressType: {
      value: addressType,
    },
    addressLine1: {
      value: formData.addressLine1,
      error: getError(validationErrors, 'addressLine1'),
    },
    addressLine2: {
      value: formData.addressLine2,
      error: getError(validationErrors, 'addressLine2'),
    },
    addressLine3: {
      value: formData.addressLine3,
      error: getError(validationErrors, 'addressLine3'),
    },
    addressLine4: {
      value: formData.addressLine4,
      error: getError(validationErrors, 'addressLine4'),
    },
    postcode: {
      value: formData.postcode,
      error: getError(validationErrors, 'postcode'),
    },
    hasAnotherAddress: {
      value: formData.hasAnotherAddress,
    },
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const getNextAddressType = (addressType: AddressType) => {
  if (addressType === 'PRIMARY') {
    return AddressTypeEnum.Enum.SECONDARY
  }

  if (addressType === 'SECONDARY') {
    return AddressTypeEnum.Enum.TERTIARY
  }

  return undefined
}

const getHasAnotherAddress = (addressType: AddressType, addresses: Array<Address>) => {
  if (addresses.length === 0) {
    return null
  }

  if (addressType === 'PRIMARY' || addressType === 'SECONDARY') {
    return addresses.some(address => address.addressType === getNextAddressType(addressType))
  }

  return false
}

const constructFromEntity = (addressType: string, addresses: Array<Address>): AddressViewModel => {
  const currentAddress = addresses.find(address => address.addressType === addressType.toUpperCase())
  const hasAnotherAddress = getHasAnotherAddress(AddressTypeEnum.parse(addressType.toUpperCase()), addresses)

  return {
    addressType: {
      value: addressType.toLowerCase(),
    },
    addressLine1: {
      value: currentAddress?.addressLine1 ?? '',
    },
    addressLine2: {
      value: currentAddress?.addressLine2 ?? '',
    },
    addressLine3: {
      value: currentAddress?.addressLine3 ?? '',
    },
    addressLine4: {
      value: currentAddress?.addressLine4 ?? '',
    },
    postcode: {
      value: currentAddress?.postcode ?? '',
    },
    hasAnotherAddress: {
      value: hasAnotherAddress?.toString() ?? '',
    },
    errorSummary: null,
  }
}

const construct = (
  addressType: string,
  addresses: Array<Address>,
  formData: AddressFormData,
  validationErrors: ValidationResult,
): AddressViewModel => {
  if (validationErrors.length > 0) {
    return constructFromFormData(addressType, formData, validationErrors)
  }

  return constructFromEntity(addressType, addresses)
}

export default {
  construct,
}
