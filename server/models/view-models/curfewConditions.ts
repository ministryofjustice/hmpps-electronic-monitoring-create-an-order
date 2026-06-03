import { deserialiseDateTime, getError } from '../../utils/utils'
import { CurfewConditions } from '../CurfewConditions'
import { ValidationResult } from '../Validation'
import { DateTimeField, ViewModel } from './utils'
import { CurfewConditionsFormData } from '../form-data/curfewConditions'
import { createGovukErrorSummary } from '../../utils/errors'
import { Order } from '../Order'

type CurfewConditionsViewModel = ViewModel<
  Omit<CurfewConditions, 'startDate' | 'endDate' | 'details' | 'curfewAdditionalDetails'>
> & {
  startDate: DateTimeField
  endDate?: DateTimeField
  showEndate: boolean
}

const createViewModelFromFormData = (
  formData: CurfewConditionsFormData,
  validationErrors: ValidationResult,
  order: Order,
): CurfewConditionsViewModel => {
  const viewModel: CurfewConditionsViewModel = {
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
    showEndate: order.interestedParties?.notifyingOrganisation !== 'HOME_OFFICE',
    errorSummary: createGovukErrorSummary(validationErrors),
  }
  if (formData.endDate) {
    viewModel.endDate = {
      value: {
        day: formData.endDate.day,
        month: formData.endDate.month,
        year: formData.endDate.year,
        hours: formData.endDate.hours,
        minutes: formData.endDate.minutes,
      },
      error: getError(validationErrors, 'endDate'),
    }
  }
  return viewModel
}

const createViewModelFromCurfewConditions = (order: Order): CurfewConditionsViewModel => {
  const { curfewConditions } = order!

  return {
    startDate: { value: deserialiseDateTime(curfewConditions?.startDate) },
    endDate: { value: deserialiseDateTime(curfewConditions?.endDate) },
    showEndate: order.interestedParties?.notifyingOrganisation !== 'HOME_OFFICE',
    errorSummary: null,
  }
}

const construct = (
  order: Order,
  validationErrors: ValidationResult,
  formData: [CurfewConditionsFormData],
): CurfewConditionsViewModel => {
  if (validationErrors.length > 0 && formData.length > 0) {
    return createViewModelFromFormData(formData[0], validationErrors, order)
  }

  return createViewModelFromCurfewConditions(order)
}

export default {
  construct,
}
