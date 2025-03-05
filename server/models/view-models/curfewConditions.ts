import { deserialiseDate, getError } from '../../utils/utils'
import { CurfewConditions } from '../CurfewConditions'
import { ValidationResult } from '../Validation'
import { DateField, MultipleChoiceField, ViewModel } from './utils'
import { CurfewConditionsFormData } from '../form-data/curfewConditions'
import { createGovukErrorSummary } from '../../utils/errors'

type CurfewConditionsViewModel = ViewModel<Omit<CurfewConditions, 'curfewAddress' | 'startDate' | 'endDate'>> & {
  addresses: MultipleChoiceField
  startDate: DateField
  endDate: DateField
}

const createViewModelFromFormData = (
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
    addresses: { values: addresses, error: getError(validationErrors, 'curfewAddress') },
    startDate: {
      value: { day: formData['startDate-day'], month: formData['startDate-month'], year: formData['startDate-year'] },
      error: getError(validationErrors, 'startDate'),
    },
    endDate: {
      value: { day: formData['endDate-day'], month: formData['endDate-month'], year: formData['endDate-year'] },
      error: getError(validationErrors, 'endDate'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createViewModelFromCurfewConditions = (
  curfewConditions: CurfewConditions | undefined | null,
): CurfewConditionsViewModel => {
  const [startDateYear, startDateMonth, startDateDay] = deserialiseDate(curfewConditions?.startDate)
  const [endDateYear, endDateMonth, endDateDay] = deserialiseDate(curfewConditions?.endDate)

  return {
    addresses: { values: curfewConditions?.curfewAddress?.split(',') ?? [] },
    startDate: { value: { day: startDateDay, month: startDateMonth, year: startDateYear } },
    endDate: { value: { day: endDateDay, month: endDateMonth, year: endDateYear } },
    errorSummary: null,
  }
}

const construct = (
  curfewConditions: CurfewConditions | undefined | null,
  validationErrors: ValidationResult,
  formData: [CurfewConditionsFormData],
): CurfewConditionsViewModel => {
  if (validationErrors.length > 0 && formData.length > 0) {
    return createViewModelFromFormData(formData[0], validationErrors)
  }

  return createViewModelFromCurfewConditions(curfewConditions)
}

export default {
  construct,
}
