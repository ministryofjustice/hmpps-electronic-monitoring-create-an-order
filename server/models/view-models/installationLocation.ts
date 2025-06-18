import { Order } from '../Order'
import { ViewModel, TextField } from './utils'
import { Address, AddressTypeEnum } from '../Address'
import { InstallationLocation } from '../InstallationLocation'
import { InstallationLocationFormData } from '../form-data/installationLocation'
import { ValidationResult } from '../Validation'
import { createGovukErrorSummary } from '../../utils/errors'
import { getError } from '../../utils/utils'

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

const constructFromFormData = (
  formData: InstallationLocationFormData,
  showTagAtSourceOptions: boolean,
  primaryAddressView: string,
  validationErrors: ValidationResult,
): InstallationLocationViewModel => {
  return {
    location: {
      value: formData.location || '',
      error: getError(validationErrors, 'location'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
    showTagAtSourceOptions,
    primaryAddressView: { value: primaryAddressView },
  }
}

const constructFromEntity = (
  showTagAtSourceOptions: boolean,
  primaryAddressView: string,
  location: string = '',
): InstallationLocationViewModel => {
  return {
    location: {
      value: location ?? '',
    },
    primaryAddressView: { value: primaryAddressView },
    errorSummary: null,
    showTagAtSourceOptions,
  }
}

const construct = (
  order: Order,
  formData: InstallationLocationFormData,
  validationErrors: ValidationResult,
): InstallationLocationViewModel => {
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

  const primaryAddressView = createPrimaryAddressView(order.addresses)

  if (validationErrors.length > 0) {
    return constructFromFormData(formData, showTagAtSourceOptions, primaryAddressView, validationErrors)
  }
  return constructFromEntity(showTagAtSourceOptions, primaryAddressView, order.installationLocation?.location)
}

export default {
  construct,
}
