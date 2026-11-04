import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/validation/errors'

import { NationalSecurityDirectorateModel } from './formModel'
import { getError } from '../../../utils/validation/errorMessages'

type NationalSecurityDirectorateViewModel = ViewModel<NationalSecurityDirectorateModel>

const construct = (errors: ValidationResult): NationalSecurityDirectorateViewModel => {
  if (errors && errors.length > 0) {
    return constructFromFormData(errors)
  }

  return {
    nationalSecurityDirectorate: {
      value: '',
    },
    errorSummary: null,
  }
}

const constructFromFormData = (errors: ValidationResult): NationalSecurityDirectorateViewModel => {
  return {
    nationalSecurityDirectorate: {
      value: '',
      error: getError(errors, 'nationalSecurityDirectorate'),
    },
    errorSummary: createGovukErrorSummary(errors),
  }
}

export default { construct }
