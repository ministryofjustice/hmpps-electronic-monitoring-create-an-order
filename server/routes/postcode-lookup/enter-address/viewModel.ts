import { ViewModel } from '../../../models/view-models/utils'
import { ValidationResult } from '../../../models/Validation'
import { getError } from '../../../utils/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { Address, AddressType } from '../../../models/Address'
import { AddressFormData } from '../../../models/form-data/address'
import I18n from '../../../types/i18n'
import ManualAddressPageContent from '../../../types/i18n/pages/manualAddress'

type AddressViewModel = ViewModel<Address> & {
  content: ManualAddressPageContent
}

const constructFromFormData = (
  addressType: AddressType,
  formData: AddressFormData,
  content: I18n,
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
    content: getContent(content, addressType),
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const constructFromEntity = (addressType: AddressType, addresses: Array<Address>, content: I18n): AddressViewModel => {
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
    content: getContent(content, addressType),
    errorSummary: null,
  }
}

const construct = (
  addressType: AddressType,
  addresses: Array<Address>,
  formData: AddressFormData,
  content: I18n,
  validationErrors: ValidationResult,
): AddressViewModel => {
  if (validationErrors.length > 0) {
    return constructFromFormData(addressType, formData, content, validationErrors)
  }

  return constructFromEntity(addressType, addresses, content)
}

function getContent(content: I18n, addressType: AddressType): ManualAddressPageContent {
  const mapping: Record<AddressType, ManualAddressPageContent> = {
    PRIMARY: content.pages.manualDeviceWearerAddress,
    SECONDARY: content.pages.manualCurfewAddress,
    TERTIARY: content.pages.manualCurfewAddress,
    INSTALLATION: content.pages.manualTagAtSourceAddress,

    // These are also not used currently, can potentially be removed
    RESPONSIBLE_ADULT: content.pages.manualDeviceWearerAddress,
    RESPONSIBLE_ORGANISATION: content.pages.manualDeviceWearerAddress,
    // Currently, mandatory attendance monitoring address is not stored as a separate address
    // appointment: content.pages.appointmentAddress,
  }

  return mapping[addressType]
}

export default { construct }
