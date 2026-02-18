import { createGovukErrorSummary } from '../../utils/errors'
import { getError } from '../../utils/utils'
import { CurfewConditions } from '../CurfewConditions'
import { CurfewAdditionalDetailsFormData } from '../form-data/curfewAdditionalDetails'
import { ValidationResult } from '../Validation'
import { ErrorMessage, ViewModel } from './utils'

type CurfewAdditionalDetailsModel = {
  curfewAdditionalDetails: { value: string; error?: ErrorMessage }
  details?: { value: string; error?: ErrorMessage }
}
type CurfewAdditionalDetailsViewModel = ViewModel<NonNullable<CurfewAdditionalDetailsModel>>

const construct = (
  model: CurfewConditions | undefined | null,
  formData: [CurfewAdditionalDetailsFormData],
  validationErrors: ValidationResult,
): CurfewAdditionalDetailsViewModel => {
  if (formData.length > 0 && validationErrors.length > 0) {
    return {
      curfewAdditionalDetails: {
        value: formData[0].curfewAdditionalDetails,
        error: getError(validationErrors, 'curfewAdditionalDetails'),
      },
      details: {
        value: formData[0].details ?? '',
        error: getError(validationErrors, 'details'),
      },
      errorSummary: createGovukErrorSummary(validationErrors),
    }
  }
  const detailsValue = getDetailsValue(model)
  return {
    curfewAdditionalDetails: { value: model?.curfewAdditionalDetails ?? '' },
    details: { value: detailsValue },
    errorSummary: null,
  }
}

const getDetailsValue = (model: CurfewConditions | undefined | null) => {
  if (model === null || model === undefined || model?.curfewAdditionalDetails === null) {
    return ''
  }
  if (model?.curfewAdditionalDetails === '') {
    return 'no'
  }
  if (model?.curfewAdditionalDetails.length > 0) {
    return 'yes'
  }
  return ''
}

export default { construct }
