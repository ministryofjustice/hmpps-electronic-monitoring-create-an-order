import { createSortedGovukErrorSummary } from '../../utils/errors'
import { deserialiseTime, getError, getErrors } from '../../utils/utils'
import { Address } from '../Address'
import { CurfewReleaseDate } from '../CurfewReleaseDate'
import { CurfewReleaseDateFormData } from '../form-data/curfewReleaseDate'
import { ValidationResult } from '../Validation'
import { TimeField, AddressViewsViewModel, getAddressViews, AddressViews } from './utils'

type CurfewReleaseDateViewModel = AddressViewsViewModel<Pick<CurfewReleaseDate, 'curfewAddress'>> & {
  curfewStartTime: TimeField
  curfewEndTime: TimeField
}

const fieldNames = {
  startTime: 'startTime',
  endTime: 'endTime',
  curfewAddress: 'curfewAddress',
} as const

const createViewModelFromCurfewReleaseDate = (
  addressViews: AddressViews,
  curfewReleaseDate?: CurfewReleaseDate | null,
): CurfewReleaseDateViewModel => {
  const [startHours, startMinutes] = deserialiseTime(curfewReleaseDate?.startTime)
  const [endHours, endMinutes] = deserialiseTime(curfewReleaseDate?.endTime)

  return {
    curfewAddress: { value: curfewReleaseDate?.curfewAddress ?? '' },
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
    curfewAddress: {
      value: formData?.curfewAddress ?? '',
      error: getError(validationErrors, fieldNames.curfewAddress),
    },
    curfewStartTime: {
      value: {
        hours: formData.curfewTimesStartHours,
        minutes: formData.curfewTimesStartMinutes,
      },
      error: getErrors(validationErrors, [fieldNames.startTime]),
    },
    curfewEndTime: {
      value: {
        hours: formData.curfewTimesEndHours,
        minutes: formData.curfewTimesEndMinutes,
      },
      error: getErrors(validationErrors, [fieldNames.endTime]),
    },
    primaryAddressView: { value: addressViews.primaryAddressView },
    secondaryAddressView: { value: addressViews.secondaryAddressView },
    tertiaryAddressView: { value: addressViews.tertiaryAddressView },
    errorSummary: createSortedGovukErrorSummary(validationErrors, Object.values(fieldNames)),
  }
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
