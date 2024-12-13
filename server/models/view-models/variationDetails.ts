import { getErrorsViewModel, isNullOrUndefined } from '../../utils/utils'
import { VariationDetails } from '../VariationDetails'
import { VariationDetailsFormData } from '../form-data/variationDetails'
import { ValidationResult } from '../Validation'

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

const createViewModelFromVariationDetails = (variationDetails: VariationDetails | null) => {
  if (isNullOrUndefined(variationDetails)) {
    return {
      errors: {},
    }
  }

  return {
    ...variationDetails,
    variationDate: deserialiseDate(variationDetails.variationDate),
    errors: {},
  }
}

const createViewModelFromFormData = (formData: VariationDetailsFormData, errors: ValidationResult) => ({
  ...formData,
  errors: getErrorsViewModel(errors),
})

const createViewModel = (
  variationDetails: VariationDetails | null,
  formData: VariationDetailsFormData,
  errors: ValidationResult,
) => {
  if (errors.length > 0) {
    return createViewModelFromFormData(formData, errors)
  }

  return createViewModelFromVariationDetails(variationDetails)
}

export default createViewModel
