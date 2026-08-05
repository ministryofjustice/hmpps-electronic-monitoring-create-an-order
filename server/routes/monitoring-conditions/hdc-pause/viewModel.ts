import { ValidationResult } from '../../../models/Validation'
import { TextField, ViewModelBase } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'

export type HdcPauseModel = ViewModelBase & {
  hdcPause: TextField
}

const contructModel = (errors: ValidationResult): HdcPauseModel => {
  const model: HdcPauseModel = {
    hdcPause: { value: '' },
    errorSummary: null,
  }

  if (errors && errors.length) {
    model.hdcPause!.error = getError(errors, 'hdcPause')
    model.errorSummary = createGovukErrorSummary(errors)
  }

  return model
}

export default contructModel
