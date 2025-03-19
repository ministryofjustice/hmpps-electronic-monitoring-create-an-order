import { createGovukErrorSummary } from '../../utils/errors'
import { deserialiseDateTime, deserialiseTime, getError, getErrors } from '../../utils/utils'
import { Address, AddressTypeEnum } from '../Address'
import { CurfewReleaseDate } from '../CurfewReleaseDate'
import { CurfewReleaseDateFormData } from '../form-data/curfewReleaseDate'
import { ValidationResult } from '../Validation'
import { DateField, TextField, TimeSpanField, TimeField, ViewModel } from './utils'

type CurfewReleaseDateViewModel = ViewModel<Pick<CurfewReleaseDate, 'curfewAddress'>> & {
  releaseDate: DateField
  curfewTimes: TimeSpanField
  curfewStartTime: TimeField
  curfewEndTime: TimeField
  primaryAddressView: TextField
  secondaryAddressView: TextField
  tertiaryAddressView: TextField
}

const createViewModelFromCurfewReleaseDate = (
  addressViews: AddressViews,
  curfewReleaseDate?: CurfewReleaseDate | null,
): CurfewReleaseDateViewModel => {
  const releaseDate = deserialiseDateTime(curfewReleaseDate?.releaseDate)
  const [startHours, startMinutes] = deserialiseTime(curfewReleaseDate?.startTime)
  const [endHours, endMinutes] = deserialiseTime(curfewReleaseDate?.endTime)

  return {
    curfewAddress: { value: curfewReleaseDate?.curfewAddress ?? '' },
    releaseDate: { value: releaseDate },
    curfewTimes: { value: { startHours, startMinutes, endHours, endMinutes } },
    curfewStartTime: { value: { hours: startHours, minutes: startMinutes } },
    curfewEndTime: { value: { hours: endHours, minutes: endMinutes } },
    primaryAddressView: { value: addressViews.primaryAddressView },
    secondaryAddressView: { value: addressViews.secondaryAddressView },
    tertiaryAddressView: { value: addressViews.tertiaryAddressView },
    errorSummary: null,
  }
}

const createViewModelFromFormData = (
  formData: CurfewReleaseDateFormData,
  addressViews: AddressViews,
  validationErrors: ValidationResult,
): CurfewReleaseDateViewModel => {
  return {
    curfewAddress: { value: formData?.address ?? '', error: getError(validationErrors, 'curfewAddress') },
    releaseDate: {
      value: {
        year: formData.releaseDateYear,
        month: formData.releaseDateMonth,
        day: formData.releaseDateDay,
      },
      error: getError(validationErrors, 'releaseDate'),
    },
    curfewTimes: {
      value: {
        startHours: formData.curfewTimesStartHours,
        startMinutes: formData.curfewTimesStartMinutes,
        endHours: formData.curfewTimesEndHours,
        endMinutes: formData.curfewTimesEndMinutes,
      },
      error: getErrors(validationErrors, ['startTime', 'endTime']),
    },
    curfewStartTime: {
      value: {
        hours: formData.curfewTimesStartHours,
        minutes: formData.curfewTimesStartMinutes,
      },
      error: getErrors(validationErrors, ['startTime']),
    },
    curfewEndTime: {
      value: {
        hours: formData.curfewTimesEndHours,
        minutes: formData.curfewTimesEndMinutes,
      },
      error: getErrors(validationErrors, ['endTime']),
    },
    primaryAddressView: { value: addressViews.primaryAddressView },
    secondaryAddressView: { value: addressViews.secondaryAddressView },
    tertiaryAddressView: { value: addressViews.tertiaryAddressView },
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}
type AddressViews = {
  primaryAddressView: string
  secondaryAddressView: string
  tertiaryAddressView: string
}
const getAddressViews = (addresses: Address[]): AddressViews => {
  const primaryAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.PRIMARY)
  const secondaryAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.SECONDARY)
  const tertiaryAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.TERTIARY)

  const addressViews = {
    primaryAddressView: primaryAddress ? primaryAddress.addressLine1 : '',
    secondaryAddressView: secondaryAddress ? secondaryAddress.addressLine1 : '',
    tertiaryAddressView: tertiaryAddress ? tertiaryAddress.addressLine1 : '',
  }

  return addressViews
}

const construct = (
  curfewReleaseDate: CurfewReleaseDate | undefined | null,
  addresses: Address[],
  validationErrors: ValidationResult,
  formData: [CurfewReleaseDateFormData],
): CurfewReleaseDateViewModel => {
  const addressViews = getAddressViews(addresses)
  if (validationErrors.length > 0 && formData.length > 0) {
    return createViewModelFromFormData(formData[0], addressViews, validationErrors)
  }

  return createViewModelFromCurfewReleaseDate(addressViews, curfewReleaseDate)
}

export default {
  construct,
}
