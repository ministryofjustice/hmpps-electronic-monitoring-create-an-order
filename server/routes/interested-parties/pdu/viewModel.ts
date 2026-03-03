import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { getError } from '../../../utils/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { ProbationDeliveryUnitInput } from './formModel'
import { ProbationDeliveryUnit } from '../../../models/ProbationDeliveryUnit'

type ProbationDeliveryUnitViewModel = ViewModel<ProbationDeliveryUnitInput>

const construct = (
  data: ProbationDeliveryUnit,
  formData: ProbationDeliveryUnitInput | undefined,
  errors: ValidationResult,
): ProbationDeliveryUnitViewModel => {
  if (errors && errors.length > 0 && formData) {
    return constructFromFormData(formData, errors)
  }

  return constructFromData(data)
}

const constructFromData = (data: ProbationDeliveryUnit): ProbationDeliveryUnitViewModel => {
  return {
    unit: {
      value: data?.unit || '',
    },
    errorSummary: null,
  }
}

const constructFromFormData = (
  formData: ProbationDeliveryUnitInput,
  errors: ValidationResult,
): ProbationDeliveryUnitViewModel => {
  return {
    unit: {
      value: formData?.unit || '',
      error: getError(errors, 'unit'),
    },
    errorSummary: createGovukErrorSummary(errors),
  }
}

export default { construct }
