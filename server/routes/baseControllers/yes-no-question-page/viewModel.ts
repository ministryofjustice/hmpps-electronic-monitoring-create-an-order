import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { YesNoQuestionFormData } from './formModel'

export type YesNoQuestionPageViewModel = ViewModel<YesNoQuestionFormData>

const constructModel = (data: string | undefined, errors: ValidationResult): YesNoQuestionPageViewModel => {
  const model: YesNoQuestionPageViewModel = {
    answer: { value: data || '' },
    errorSummary: null,
  }

  if (errors && errors.length) {
    model.answer!.error = getError(errors, 'answer')
    model.errorSummary = createGovukErrorSummary(errors)
  }

  return model
}

export default constructModel
