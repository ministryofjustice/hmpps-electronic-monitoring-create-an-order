import { ValidationResult } from '../../../models/Validation'
import DeviceWearerPageContent from '../../../types/i18n/pages/deviceWearer'
import { getError } from '../../../utils/validation/errorMessages'
import { createGovukErrorSummary } from '../../../utils/validation/errors'
import { convertBooleanToEnum } from '../../../utils/values'
import { INTERPRETER_REQUIRED_DONT_KNOW } from './formModel'

type LanguageAnswers = {
  // Saved answers are booleans, rejected answers are the submitted strings
  interpreterRequired?: boolean | string | null
  language?: string | null
}

const interpreterRequiredValue = (interpreterRequired: LanguageAnswers['interpreterRequired']): string =>
  typeof interpreterRequired === 'string'
    ? interpreterRequired
    : convertBooleanToEnum(interpreterRequired, '', 'true', 'false')

const construct = (
  { interpreterRequired, language }: LanguageAnswers,
  content: DeviceWearerPageContent['languagePage'],
  disabled: boolean,
  errors: ValidationResult = [],
) => ({
  interpreterRequired: {
    value: interpreterRequiredValue(interpreterRequired),
    items: [
      { value: 'true', text: 'Yes', disabled },
      { value: 'false', text: 'No', disabled },
      { divider: 'or' },
      { value: INTERPRETER_REQUIRED_DONT_KNOW, text: content.interpreterRequiredDontKnow, disabled },
    ],
    error: getError(errors, 'interpreterRequired'),
  },
  language: {
    value: language ?? '',
    error: getError(errors, 'language'),
  },
  errorSummary: createGovukErrorSummary(errors),
})

export default { construct }
