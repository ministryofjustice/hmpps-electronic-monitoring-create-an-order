import { createGovukErrorSummary } from '../../utils/errors'
import { deserialiseDateTime, getError } from '../../utils/utils'
import { Address, AddressTypeEnum } from '../Address'
import { AlcoholMonitoring } from '../AlcoholMonitoring'
import { AlcoholMonitoringFormData } from '../form-data/alcoholMonitoring'
import { ValidationResult } from '../Validation'
import { DateTimeField, TextField, ViewModel } from './utils'

type AlcoholMonitoringViewModel = ViewModel<Pick<AlcoholMonitoring, 'monitoringType'>> & {
  startDate: DateTimeField
  endDate: DateTimeField
  primaryAddressView: TextField
  secondaryAddressView: TextField
  tertiaryAddressView: TextField
  installationAddressView: TextField
}

type AddressViews = {
  primaryAddressView: string
  secondaryAddressView: string
  tertiaryAddressView: string
  installationAddressView: string
}

const createViewModelFromAlcoholMonitoring = (
  monitoringConditionsAlcohol: AlcoholMonitoring,
  addressViews: AddressViews,
): AlcoholMonitoringViewModel => {
  const startDate = deserialiseDateTime(monitoringConditionsAlcohol?.startDate)
  const endDate = deserialiseDateTime(monitoringConditionsAlcohol?.endDate)

  return {
    monitoringType: { value: monitoringConditionsAlcohol?.monitoringType ?? '' },
    startDate: { value: startDate },
    endDate: { value: endDate },
    primaryAddressView: { value: addressViews.primaryAddressView },
    secondaryAddressView: { value: addressViews.secondaryAddressView },
    tertiaryAddressView: { value: addressViews.tertiaryAddressView },
    installationAddressView: { value: addressViews.installationAddressView },
    errorSummary: null,
  }
}

const createViewModelFromFormData = (
  formData: AlcoholMonitoringFormData,
  addressViews: AddressViews,
  validationErrors: ValidationResult,
): AlcoholMonitoringViewModel => {
  return {
    monitoringType: { value: formData.monitoringType ?? '', error: getError(validationErrors, 'monitoringType') },
    startDate: {
      value: {
        day: formData.startDate.day,
        month: formData.startDate.month,
        year: formData.startDate.year,
        hours: formData.startDate.hours,
        minutes: formData.startDate.minutes,
      },
      error: getError(validationErrors, 'startDate'),
    },
    endDate: {
      value: {
        day: formData.endDate.day,
        month: formData.endDate.month,
        year: formData.endDate.year,
        hours: formData.endDate.hours,
        minutes: formData.endDate.minutes,
      },
      error: getError(validationErrors, 'endDate'),
    },
    primaryAddressView: { value: addressViews.primaryAddressView },
    secondaryAddressView: { value: addressViews.secondaryAddressView },
    tertiaryAddressView: { value: addressViews.tertiaryAddressView },
    installationAddressView: { value: addressViews.installationAddressView },
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createAddressView = (address: Address) => {
  return `${address.addressLine1}, ${address.addressLine2}, ${address.postcode}`
}

const getAddressViews = (addresses: Address[]): AddressViews => {
  const primaryAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.PRIMARY)
  const secondaryAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.SECONDARY)
  const tertiaryAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.TERTIARY)
  const installationAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.INSTALLATION)

  const addressViews = {
    primaryAddressView: primaryAddress ? createAddressView(primaryAddress) : '',
    secondaryAddressView: secondaryAddress ? createAddressView(secondaryAddress) : '',
    tertiaryAddressView: tertiaryAddress ? createAddressView(tertiaryAddress) : '',
    installationAddressView: installationAddress ? createAddressView(installationAddress) : '',
  }

  return addressViews
}

const construct = (
  monitoringConditionsAlcohol: AlcoholMonitoring,
  addresses: Address[],
  validationErrors: ValidationResult,
  formData: [AlcoholMonitoringFormData],
): AlcoholMonitoringViewModel => {
  const addressViews = getAddressViews(addresses)

  if (validationErrors.length > 0 && formData.length > 0) {
    return createViewModelFromFormData(formData[0], addressViews, validationErrors)
  }

  return createViewModelFromAlcoholMonitoring(monitoringConditionsAlcohol, addressViews)
}

export default {
  construct,
}
