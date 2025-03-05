import { createGovukErrorSummary } from '../../utils/errors'
import { deserialiseDate, getError } from '../../utils/utils'
import { Address, AddressTypeEnum } from '../Address'
import { AlcoholMonitoring } from '../AlcoholMonitoring'
import { AlcoholMonitoringFormData } from '../form-data/alcoholMonitoring'
import { ValidationResult } from '../Validation'
import { DateField, TextField, ViewModel } from './utils'

type AlcoholMonitoringViewModel = ViewModel<
  Pick<AlcoholMonitoring, 'installationLocation' | 'monitoringType' | 'prisonName' | 'probationOfficeName'>
> & {
  startDate: DateField
  endDate: DateField
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
  const [startDateYear, startDateMonth, startDateDay] = deserialiseDate(monitoringConditionsAlcohol?.startDate)
  const [endDateYear, endDateMonth, endDateDay] = deserialiseDate(monitoringConditionsAlcohol?.endDate)

  return {
    monitoringType: { value: monitoringConditionsAlcohol?.monitoringType ?? '' },
    startDate: { value: { day: startDateDay, month: startDateMonth, year: startDateYear } },
    endDate: { value: { day: endDateDay, month: endDateMonth, year: endDateYear } },
    installationLocation: { value: monitoringConditionsAlcohol?.installationLocation ?? '' },
    probationOfficeName: { value: monitoringConditionsAlcohol?.probationOfficeName ?? '' },
    prisonName: { value: monitoringConditionsAlcohol?.prisonName ?? '' },
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
        day: formData['startDate-day'],
        month: formData['startDate-month'],
        year: formData['startDate-year'],
      },
      error: getError(validationErrors, 'startDate'),
    },
    endDate: {
      value: { day: formData['endDate-day'], month: formData['endDate-month'], year: formData['endDate-year'] },
      error: getError(validationErrors, 'endDate'),
    },
    installationLocation: {
      value: formData.installationLocation ?? '',
      error: getError(validationErrors, 'installationLocation'),
    },
    probationOfficeName: {
      value: formData.probationOfficeName ?? '',
      error: getError(validationErrors, 'probationOfficeName'),
    },
    prisonName: { value: formData.prisonName ?? '', error: getError(validationErrors, 'prisonName') },
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
