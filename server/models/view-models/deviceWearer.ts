import { createGovukErrorSummary } from '../../utils/errors'
import FeatureFlags from '../../utils/featureFlags'
import { convertBooleanToEnum, deserialiseDateTime, getError } from '../../utils/utils'
import { DeviceWearer } from '../DeviceWearer'
import { DeviceWearerFormData } from '../form-data/deviceWearer'
import { ValidationResult } from '../Validation'
import { DateField, ViewModel } from './utils'

type DeviceWearerViewModel = ViewModel<
  Required<
    Pick<
      DeviceWearer,
      | 'firstName'
      | 'lastName'
      | 'alias'
      | 'adultAtTimeOfInstallation'
      | 'sex'
      | 'gender'
      | 'disabilities'
      | 'language'
      | 'interpreterRequired'
      | 'otherDisability'
    >
  >
> & {
  dateOfBirth: DateField
}

const constructFromFormData = (
  formData: DeviceWearerFormData,
  validationErrors: ValidationResult,
): DeviceWearerViewModel => {
  return {
    firstName: {
      value: formData.firstName,
      error: getError(validationErrors, 'firstName'),
    },
    lastName: {
      value: formData.lastName,
      error: getError(validationErrors, 'lastName'),
    },
    alias: {
      value: formData.alias,
      error: getError(validationErrors, 'alias'),
    },
    dateOfBirth: {
      value: formData.dateOfBirth,
      error: getError(validationErrors, 'dateOfBirth'),
    },
    adultAtTimeOfInstallation: {
      value: formData.adultAtTimeOfInstallation,
      error: getError(validationErrors, 'adultAtTimeOfInstallation'),
    },
    sex: {
      value: formData.sex,
      error: getError(validationErrors, 'sex'),
    },
    gender: {
      value: formData.gender,
      error: getError(validationErrors, 'gender'),
    },
    disabilities: {
      values: formData.disabilities,
      error: getError(validationErrors, 'disabilities'),
    },
    interpreterRequired: {
      value: formData.interpreterRequired,
      error: getError(validationErrors, 'interpreterRequired'),
    },
    language: {
      value: formData.language,
      error: getError(validationErrors, 'language'),
    },
    otherDisability: {
      value: formData.otherDisability || '',
      error: getError(validationErrors, 'otherDisability'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createFromEntity = (deviceWearer: DeviceWearer): DeviceWearerViewModel => {
  return {
    firstName: {
      value: deviceWearer.firstName || '',
    },
    lastName: {
      value: deviceWearer.lastName || '',
    },
    alias: {
      value: deviceWearer.alias || '',
    },
    dateOfBirth: {
      value: deserialiseDateTime(deviceWearer.dateOfBirth),
    },
    adultAtTimeOfInstallation: {
      value: convertBooleanToEnum(deviceWearer.adultAtTimeOfInstallation, '', 'true', 'false'),
    },
    sex: {
      value: deviceWearer.sex || '',
    },
    gender: {
      value: deviceWearer.gender || '',
    },
    disabilities: {
      values: deviceWearer.disabilities,
    },
    interpreterRequired: {
      value: convertBooleanToEnum(deviceWearer.interpreterRequired, '', 'true', 'false'),
    },
    language: {
      value: deviceWearer.language || '',
    },
    otherDisability: {
      value: deviceWearer.otherDisability || '',
    },
    errorSummary: null,
  }
}

const construct = (
  deviceWearer: DeviceWearer,
  formData: DeviceWearerFormData,
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
