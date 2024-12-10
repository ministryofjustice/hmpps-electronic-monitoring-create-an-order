import { getErrorsViewModel } from '../../utils/utils'
import { VariationDetails } from '../VariationDetails'
import { VariationDetailsFormData } from '../form-data/variationDetails'
import { ValidationResult } from '../Validation'

const createViewModelFromVariationDetails = (variationDetails: VariationDetails) => ({
  ...variationDetails,
  errors: {},
})

const createViewModelFromFormData = (formData: VariationDetailsFormData, errors: ValidationResult) => ({
  ...formData,
  errors: getErrorsViewModel(errors),
})

const createViewModel = (
  variationDetails: VariationDetails,
  formData: VariationDetailsFormData,
  errors: ValidationResult,
) => {
  if (errors.length > 0) {
    return createViewModelFromFormData(formData, errors)
  }

  return createViewModelFromVariationDetails(variationDetails)
}

export default createViewModel
