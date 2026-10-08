import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { ProbationDeliveryUnit } from '../../../models/ProbationDeliveryUnit'
import { ProbationDeliveryUnitFormData } from './formModel'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'

type ProbationDeliveryUnitViewModel = ViewModel<NonNullable<ProbationDeliveryUnit>>

const constructFromFormData = (
  formData: ProbationDeliveryUnitFormData,
  validationErrors: ValidationResult,
): ProbationDeliveryUnitViewModel => {
  return {
    unit: {
      value: formData.unit || '',
      error: getError(validationErrors, 'unit'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const constructFromEntity = (probationDeliveryUnit: ProbationDeliveryUnit): ProbationDeliveryUnitViewModel => {
  if (probationDeliveryUnit) {
    return {
      unit: {
        value: probationDeliveryUnit.unit ?? '',
      },
      errorSummary: null,
    }
  }
  return {
    unit: {
      value: '',
    },
    errorSummary: null,
  }
}

const construct = (
  probationDeliveryUnit: ProbationDeliveryUnit,
  formData: ProbationDeliveryUnitFormData,
  validationErrors: ValidationResult,
): ProbationDeliveryUnitViewModel => {
  if (validationErrors.length > 0) {
    return constructFromFormData(formData, validationErrors)
  }

  return constructFromEntity(probationDeliveryUnit)
}

export default {
  construct,
}
