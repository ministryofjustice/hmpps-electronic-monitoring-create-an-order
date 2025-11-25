import { deserialiseDateTime, getError } from '../../utils/utils'
import { CurfewConditions } from '../CurfewConditions'
import { ValidationResult } from '../Validation'
import { DateTimeField, ViewModel } from './utils'
import { CurfewConditionsFormData } from '../form-data/curfewConditions'
import { createGovukErrorSummary } from '../../utils/errors'

type CurfewConditionsViewModel = ViewModel<
  Omit<CurfewConditions, 'startDate' | 'endDate' | 'curfewAdditionalDetails'>
> & {
  startDate: DateTimeField
  endDate: DateTimeField
}

const createViewModelFromFormData = (
  formData: CurfewConditionsFormData,
  validationErrors: ValidationResult,
): CurfewConditionsViewModel => {
  return {
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
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createViewModelFromCurfewConditions = (
  curfewConditions: CurfewConditions | undefined | null,
): CurfewConditionsViewModel => {
  return {
    startDate: { value: deserialiseDateTime(curfewConditions?.startDate) },
    endDate: { value: deserialiseDateTime(curfewConditions?.endDate) },
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
