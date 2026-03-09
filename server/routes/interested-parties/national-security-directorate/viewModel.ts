import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { getError } from '../../../utils/utils'
import { createGovukErrorSummary } from '../../../utils/errors'

import { NationalSecurityDirectorateModel } from './formModel'

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
