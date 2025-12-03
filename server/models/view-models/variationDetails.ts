import { deserialiseDateTime, getError } from '../../utils/utils'
import { VariationDetails } from '../VariationDetails'
import { VariationDetailsFormData } from '../form-data/variationDetails'
import { ValidationResult } from '../Validation'
import { DateField, ViewModel } from './utils'
import { createGovukErrorSummary } from '../../utils/errors'
import { Order } from '../Order'

type VariationDetailsViewModel = ViewModel<Omit<VariationDetails, 'variationDate'>> & {
  variationDate: DateField
  type: string
}

const createViewModelFromFormData = (
  formData: VariationDetailsFormData,
  validationErrors: ValidationResult,
  order: Order,
): VariationDetailsViewModel => {
  return {
    variationType: {
      value: formData.variationType,
      error: getError(validationErrors, 'variationType'),
    },
    variationDate: {
      value: formData.variationDate,
      error: getError(validationErrors, 'variationDate'),
    },
    variationDetails: {
      value: formData.variationDetails,
      error: getError(validationErrors, 'variationDetails'),
    },
    type: order.type,
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createViewModelFromEntity = (order: Order): VariationDetailsViewModel => {
  return {
    variationType: {
      value: order.variationDetails?.variationType ?? '',
    },
    variationDate: {
      value: deserialiseDateTime(order.variationDetails?.variationDate ?? null),
    },
    variationDetails: {
      value: order.variationDetails?.variationDetails ?? '',
    },
    type: order.type,
    errorSummary: null,
  }
}

const createViewModel = (
  order: Order,
  formData: VariationDetailsFormData,
  errors: ValidationResult,
): VariationDetailsViewModel => {
  if (errors.length > 0) {
    return createViewModelFromFormData(formData, errors, order)
  }

  return createViewModelFromEntity(order)
}

export default createViewModel
