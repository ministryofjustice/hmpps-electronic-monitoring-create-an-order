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
  pilotPrison?: boolean
  fixedAddressExist: boolean
}

const installAtSourcePilotPrisons = [
  'PETERBOROUGH_PRISON',
  'FOSSE_WAY_PRISON',
  'SUDBURY_PRISON',
  'RANBY_PRISON',
  'SWANSEA_PRISON',
  'CARDIFF_PRISON',
]

const getPilotPrisonStatus = (order: Order): boolean => {
  const prisonName = order.interestedParties?.notifyingOrganisationName
  const count = installAtSourcePilotPrisons.filter(prison => prison === prisonName).length
  return count > 0
}

const createPrimaryAddressView = (addresses: Address[]): string => {
  const primaryAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.PRIMARY)
  return primaryAddress
    ? `${primaryAddress.addressLine1}, ${primaryAddress.addressLine3}, ${primaryAddress.postcode}`
    : ''
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
