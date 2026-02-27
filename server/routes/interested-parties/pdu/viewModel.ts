import { InterestedParties } from '../model'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { getError } from '../../../utils/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { ProbationDeliveryUnitInput } from './formModel'

type ProbationDeliveryUnitViewModel = ViewModel<Pick<InterestedParties, 'probationDeliveryUnit'>>

const construct = (
  data: InterestedParties,
  formData: ProbationDeliveryUnitInput | undefined,
  errors: ValidationResult,
): ProbationDeliveryUnitViewModel => {
  if (formData) return constructFromFormData(formData, errors)

  return constructFromData(data)
}

const constructFromData = (data: InterestedParties): ProbationDeliveryUnitViewModel => {
  return {
    probationDeliveryUnit: {
      value: data.probationDeliveryUnit || '',
    },
    errorSummary: null,
  }
}

const constructFromFormData = (
  formData: ProbationDeliveryUnitInput,
  errors: ValidationResult,
): ProbationDeliveryUnitViewModel => {
  return {
    probationDeliveryUnit: {
      value: formData?.unit || '',
      error: getError(errors, 'unit'),
    },
    errorSummary: createGovukErrorSummary(errors),
  }
}

export default { construct }
