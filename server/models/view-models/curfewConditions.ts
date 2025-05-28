import { deserialiseDateTime, getError } from '../../utils/utils'
import { CurfewConditions } from '../CurfewConditions'
import { ValidationResult } from '../Validation'
import { DateTimeField, MultipleChoiceField, AddressViewsViewModel, getAddressViews, AddressViews } from './utils'
import { CurfewConditionsFormData } from '../form-data/curfewConditions'
import { createGovukErrorSummary } from '../../utils/errors'
import { Address } from '../Address'

type CurfewConditionsViewModel = AddressViewsViewModel<
  Omit<CurfewConditions, 'curfewAddress' | 'startDate' | 'endDate'>
> & {
  addresses: MultipleChoiceField
  startDate: DateTimeField
  endDate: DateTimeField
}

const createViewModelFromFormData = (
  addressViews: AddressViews,
  formData: CurfewConditionsFormData,
  validationErrors: ValidationResult,
): CurfewConditionsViewModel => {
  let addresses: string[] = []
  if (Array.isArray(formData.addresses)) {
    addresses = formData.addresses
  } else if (formData.addresses) {
    addresses = [formData.addresses]
  }

  return {
    addresses: {
      values: addresses,
      error: getError(validationErrors, 'curfewAddress') || getError(validationErrors, 'addresses'),
    },
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
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createViewModelFromCurfewConditions = (
  addressViews: AddressViews,
  curfewConditions: CurfewConditions | undefined | null,
): CurfewConditionsViewModel => {
  return {
    addresses: { values: curfewConditions?.curfewAddress?.split(',') ?? [] },
    startDate: { value: deserialiseDateTime(curfewConditions?.startDate) },
    endDate: { value: deserialiseDateTime(curfewConditions?.endDate) },
    primaryAddressView: { value: addressViews.primaryAddressView },
    secondaryAddressView: { value: addressViews.secondaryAddressView },
    tertiaryAddressView: { value: addressViews.tertiaryAddressView },
    errorSummary: null,
  }
}

const construct = (
  curfewConditions: CurfewConditions | undefined | null,
  addresses: Address[],
  validationErrors: ValidationResult,
  formData: [CurfewConditionsFormData],
): CurfewConditionsViewModel => {
  const addressViews = getAddressViews(addresses)
  if (validationErrors.length > 0 && formData.length > 0) {
    return createViewModelFromFormData(addressViews, formData[0], validationErrors)
  }

  return createViewModelFromCurfewConditions(addressViews, curfewConditions)
}

export default {
  construct,
}
