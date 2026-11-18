import { ValidationResult } from '../../../models/Validation'
import { FormField, TextField } from '../../../models/view-models/utils'
import { deserialiseDateTime } from '../../../utils/dateTime'
import { getError } from '../../../utils/validation/errorMessages'
import { createGovukErrorSummary } from '../../../utils/validation/errors'
import { ErrorSummary } from '../../../utils/views/govukFrontEndTypes/errorSummary'
import { DeviceWearerCache } from '../store/model'
import { DeviceWearerDetailsFormData } from './formModel'

export type DeviceWearerDetailsViewModel = {
  firstName: TextField
  middleName: TextField
  lastName: TextField
  alias: TextField
  dateOfBirth: FormField & { value: DeviceWearerDetailsFormData['dateOfBirth'] }
  sex: TextField
  gender: TextField
  errorSummary: ErrorSummary | null
}

const valuesFromAnswers = (answers: DeviceWearerCache): DeviceWearerDetailsFormData => {
  const { day, month, year } = deserialiseDateTime(answers.dateOfBirth)

  return {
    firstName: answers.firstName ?? '',
    middleName: answers.middleName ?? '',
    lastName: answers.lastName ?? '',
    alias: answers.alias ?? '',
    dateOfBirth: { day, month, year },
    sex: answers.sex ?? '',
    gender: answers.gender ?? '',
  }
}

const field = <T>(value: T, errors: ValidationResult, name: string) => {
  const error = getError(errors, name)
  return error ? { value, error } : { value }
}

// Submitted form data is only redisplayed alongside the errors it caused,
// otherwise the page shows the answers saved so far (which may have API errors against them).
const construct = (
  answers: DeviceWearerCache,
  formData: DeviceWearerDetailsFormData | undefined,
  errors: ValidationResult,
): DeviceWearerDetailsViewModel => {
  const values = formData && errors.length > 0 ? formData : valuesFromAnswers(answers)

  return {
    firstName: field(values.firstName, errors, 'firstName'),
    middleName: field(values.middleName, errors, 'middleName'),
    lastName: field(values.lastName, errors, 'lastName'),
    alias: field(values.alias, errors, 'alias'),
    dateOfBirth: field(values.dateOfBirth, errors, 'dateOfBirth'),
    sex: field(values.sex, errors, 'sex'),
    gender: field(values.gender, errors, 'gender'),
    errorSummary: createGovukErrorSummary(errors),
  }
}

export default { construct }
