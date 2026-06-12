import { deserialiseDateTime, getError } from '../../utils/utils'
import { VariationDetails } from '../VariationDetails'
import { VariationDetailsFormData } from '../form-data/variationDetails'
import { ValidationResult } from '../Validation'
import { DateField, TextField, ViewModel } from './utils'
import { createGovukErrorSummary } from '../../utils/errors'
import { Order } from '../Order'

type VariationDetailsViewModel = ViewModel<Omit<VariationDetails, 'variationDate'>> & {
  variationDate: DateField
  variationDetailsAvailable: TextField
  type: string
}

const createViewModelFromFormData = (
  formData: VariationDetailsFormData,
  validationErrors: ValidationResult,
  order: Order,
): VariationDetailsViewModel => {
  return {
    variationDate: {
      value: formData.variationDate,
      error: getError(validationErrors, 'variationDate'),
    },
    variationDetails: {
      value: formData.variationDetails || '',
      error: getError(validationErrors, 'variationDetails'),
    },
    variationDetailsAvailable: {
      value: formData.variationDetailsAvailable || '',
      error: getError(validationErrors, 'variationDetailsAvailable'),
    },
    type: order.type,
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createViewModelFromEntity = (order: Order): VariationDetailsViewModel => {
  return {
    variationDate: {
      value: deserialiseDateTime(order.variationDetails?.variationDate ?? null),
    },
    variationDetails: {
      value: order.variationDetails?.variationDetails ?? '',
    },
    variationDetailsAvailable: {
      value: order.variationDetails?.variationDetails ? 'true' : '',
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
