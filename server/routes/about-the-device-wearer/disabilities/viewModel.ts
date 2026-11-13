import { Disability } from '../../../models/DeviceWearer'
import { ValidationResult } from '../../../models/Validation'
import { MultipleChoiceField, TextField, ViewModelBase } from '../../../models/view-models/utils'
import { getError } from '../../../utils/validation/errorMessages'
import { createGovukErrorSummary } from '../../../utils/validation/errors'
import { DeviceWearerCache } from '../store/model'
import { DisabilitiesFormData } from './formModel'

type DisabilitiesViewModel = ViewModelBase & {
  disabilities: MultipleChoiceField & { values: Disability[] }
  otherDisability: TextField
}

const construct = (
  answers: DeviceWearerCache,
  formData: DisabilitiesFormData | undefined,
  errors: ValidationResult,
): DisabilitiesViewModel => {
  const error = getError(errors, 'disabilities')
  const otherDisabilityError = getError(errors, 'otherDisability')

  return {
    disabilities: {
      values: formData?.disabilities ?? answers.disabilities ?? [],
      ...(error ? { error } : {}),
    },
    otherDisability: {
      value: formData?.otherDisability ?? answers.otherDisability ?? '',
      ...(otherDisabilityError ? { error: otherDisabilityError } : {}),
    },
    errorSummary: createGovukErrorSummary(errors),
  }
}

export default { construct }
