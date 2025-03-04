import { getError } from '../../utils/utils'
import { VariationDetails } from '../VariationDetails'
import { VariationDetailsFormData } from '../form-data/variationDetails'
import { ValidationResult } from '../Validation'
import { DateField, ViewModel } from './utils'
import { createGovukErrorSummary } from '../../utils/errors'

type VariationDetailsViewModel = ViewModel<Omit<VariationDetails, 'variationDate'>> & {
  variationDate: DateField
}

const deserialiseDate = (dateString: string | null) => {
  if (dateString === null || dateString === '') {
    return {
      day: '',
      month: '',
      year: '',
    }
  }

  const date = new Date(dateString)

  return {
    day: date.getDate().toString(),
    month: (date.getMonth() + 1).toString(),
    year: date.getFullYear().toString(),
  }
}

const createViewModelFromFormData = (
  formData: VariationDetailsFormData,
  validationErrors: ValidationResult,
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
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createViewModelFromEntity = (variationDetails: VariationDetails | null): VariationDetailsViewModel => {
  return {
    variationType: {
      value: variationDetails?.variationType ?? '',
    },
    variationDate: {
      value: deserialiseDate(variationDetails?.variationDate ?? null),
    },
    errorSummary: null,
  }
}

const createViewModel = (
  variationDetails: VariationDetails | null,
  formData: VariationDetailsFormData,
  errors: ValidationResult,
): VariationDetailsViewModel => {
  if (errors.length > 0) {
    return createViewModelFromFormData(formData, errors)
  }

  return createViewModelFromEntity(variationDetails)
}

export default createViewModel
