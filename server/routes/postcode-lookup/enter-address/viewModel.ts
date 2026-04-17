import { ViewModel } from '../../../models/view-models/utils'
import { ValidationResult } from '../../../models/Validation'
import { getError } from '../../../utils/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { Address, AddressType } from '../../../models/Address'
import { AddressFormData } from '../../../models/form-data/address'

type AddressViewModel = ViewModel<Address>

const constructFromFormData = (
  addressType: AddressType,
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
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const constructFromEntity = (addressType: AddressType, addresses: Array<Address>): AddressViewModel => {
  const currentAddress = addresses.find(address => address.addressType === addressType.toUpperCase())

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
    errorSummary: null,
  }
}

const construct = (
  addressType: AddressType,
  addresses: Array<Address>,
  formData: AddressFormData,
  validationErrors: ValidationResult,
): AddressViewModel => {
  if (validationErrors.length > 0) {
    return constructFromFormData(addressType, formData, validationErrors)
  }

  return constructFromEntity(addressType, addresses)
}

export default { construct }
