import { constructYesNoField, constuctTextField, TextField, YesNoField } from './utils'
import { ValidationResult } from '../Validation'
import { AddressDetailsFormData } from '../form-data/addressDetails'
import { Address } from '../Address'

type AddressViewModel = {
    addressLine1: TextField
    addressLine2: TextField
    addressLine3: TextField
    addressLine4: TextField
    postcode: TextField
    hasAnotherAddress: YesNoField
}

const constructFromFormData = (formData: AddressDetailsFormData, validationErrors: ValidationResult) => {
  return {
    addressLine1: constuctTextField('addressLine1', formData.addressLine1, validationErrors),
    addressLine2: constuctTextField('addressLine2', formData.addressLine2, validationErrors),
    addressLine3: constuctTextField('addressLine3', formData.addressLine3, validationErrors),
    addressLine4: constuctTextField('addressLine4', formData.addressLine4, validationErrors),
    postcode: constuctTextField('postcode', formData.postcode, validationErrors),
    hasAnotherAddress: constructYesNoField('hasAnotherAddress', formData.hasAnotherAddress, validationErrors),
  }
}

const constructFromEntity = (address: Address, hasAnotherAddress: boolean) => {
  return {
    addressLine1: constuctTextField('addressLine1', address.addressLine1, []),
    addressLine2: constuctTextField('addressLine2', address.addressLine2, []),
    addressLine3: constuctTextField('addressLine3', address.addressLine3, []),
    addressLine4: constuctTextField('addressLine4', address.addressLine4, []),
    postcode: constuctTextField('postcode', address.postcode, []),
    hasAnotherAddress: constructYesNoField('hasAnotherAddress', hasAnotherAddress, []),
  }
}

const construct = (
  address: Address,
  formData: AddressDetailsFormData,
  validationErrors: ValidationResult,
  hasAnotherAddress: boolean,
): AddressViewModel => {
  if (validationErrors.length > 0) {
    return constructFromFormData(formData, validationErrors)
  }

  return constructFromEntity(address, hasAnotherAddress)
}

export default {
  construct,
}
