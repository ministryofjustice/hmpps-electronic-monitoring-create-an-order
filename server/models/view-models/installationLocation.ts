import { Order } from '../Order'
import { ViewModel, TextField } from './utils'
import { Address, AddressTypeEnum } from '../Address'
import { InstallationLocation } from '../InstallationLocation'
import { InstallationLocationFormData } from '../form-data/installationLocation'
import { ValidationResult } from '../Validation'
import { createGovukErrorSummary } from '../../utils/errors'
import FeatureFlags from '../../utils/featureFlags'
import { createAddressPreview, getError } from '../../utils/utils'

type InstallationLocationViewModel = ViewModel<InstallationLocation> & {
  primaryAddressView: TextField
  pilotPrison?: boolean
  fixedAddressExist: boolean
}

const getPilotPrisonStatus = (order: Order): boolean => {
  if (order.interestedParties?.notifyingOrganisation === 'PRISON') {
    const prisons = FeatureFlags.getInstance().getValue('TAG_AT_SOURCE_PILOT_PRISONS').split(',')
    return prisons?.indexOf(order.interestedParties.notifyingOrganisationName ?? '') !== -1
  }
  return false
}

const createPrimaryAddressView = (addresses: Address[]): string => {
  const primaryAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.PRIMARY)
  return primaryAddress ? createAddressPreview(primaryAddress) : ''
}

const hasFixedAddress = (order: Order): boolean => {
  const primaryAddress = order.addresses.find(({ addressType }) => addressType === 'PRIMARY')
  return primaryAddress !== undefined
}

const constructFromFormData = (
  formData: InstallationLocationFormData,
  primaryAddressView: string,
  validationErrors: ValidationResult,
  order: Order,
): InstallationLocationViewModel => {
  return {
    location: {
      value: formData.location || '',
      error: getError(validationErrors, 'location'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
    primaryAddressView: { value: primaryAddressView },
    pilotPrison: getPilotPrisonStatus(order),
    fixedAddressExist: hasFixedAddress(order),
  }
}

const constructFromEntity = (
  primaryAddressView: string,
  order: Order,
  location: string = '',
): InstallationLocationViewModel => {
  return {
    location: {
      value: location ?? '',
    },
    primaryAddressView: { value: primaryAddressView },
    errorSummary: null,
    pilotPrison: getPilotPrisonStatus(order),
    fixedAddressExist: hasFixedAddress(order),
  }
}

const construct = (
  order: Order,
  formData: InstallationLocationFormData,
  validationErrors: ValidationResult,
): InstallationLocationViewModel => {
  const primaryAddressView = createPrimaryAddressView(order.addresses)

  if (validationErrors.length > 0) {
    return constructFromFormData(formData, primaryAddressView, validationErrors, order)
  }
  return constructFromEntity(primaryAddressView, order, order.installationLocation?.location)
}

export default {
  construct,
}
