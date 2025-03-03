import { createGovukErrorSummary } from '../../utils/errors'
import { getError } from '../../utils/utils'
import { DeviceWearer } from '../DeviceWearer'
import { IdentityNumbersFormData } from '../form-data/deviceWearer'
import { ValidationResult } from '../Validation'
import { ViewModel } from './utils'

type DeviceWearerViewModel = ViewModel<
  Pick<DeviceWearer, 'nomisId' | 'deliusId' | 'pncId' | 'prisonNumber' | 'homeOfficeReferenceNumber'>
>

const constructFromFormData = (
  formData: IdentityNumbersFormData,
  validationErrors: ValidationResult,
): DeviceWearerViewModel => {
  return {
    nomisId: {
      value: formData.nomisId,
      error: getError(validationErrors, 'nomisId'),
    },
    deliusId: {
      value: formData.deliusId,
      error: getError(validationErrors, 'deliusId'),
    },
    pncId: {
      value: formData.pncId,
      error: getError(validationErrors, 'pncId'),
    },
    prisonNumber: {
      value: formData.prisonNumber,
      error: getError(validationErrors, 'prisonNumber'),
    },
    homeOfficeReferenceNumber: {
      value: formData.homeOfficeReferenceNumber,
      error: getError(validationErrors, 'homeOfficeReferenceNumber'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createFromEntity = (deviceWearer: DeviceWearer): DeviceWearerViewModel => {
  return {
    nomisId: {
      value: deviceWearer.nomisId || '',
    },
    deliusId: {
      value: deviceWearer.deliusId || '',
    },
    pncId: {
      value: deviceWearer.pncId || '',
    },
    prisonNumber: {
      value: deviceWearer.prisonNumber || '',
    },
    homeOfficeReferenceNumber: {
      value: deviceWearer.homeOfficeReferenceNumber || '',
    },
    errorSummary: null,
  }
}

const construct = (
  deviceWearer: DeviceWearer,
  formData: IdentityNumbersFormData,
  errors: ValidationResult,
): DeviceWearerViewModel => {
  if (errors.length > 0) {
    return constructFromFormData(formData, errors)
  }

  return createFromEntity(deviceWearer)
}

export default {
  construct,
}
