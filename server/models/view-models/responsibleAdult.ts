import { createGovukErrorSummary } from '../../utils/errors'
import { getError } from '../../utils/utils'
import { DeviceWearerResponsibleAdult } from '../DeviceWearerResponsibleAdult'
import { DeviceWearerResponsibleAdultFormData } from '../form-data/responsibleAdult'
import { ValidationResult } from '../Validation'
import { ViewModel } from './utils'

type ResponsibleAdultViewModel = ViewModel<DeviceWearerResponsibleAdult>

const constructFromFormData = (
  formData: DeviceWearerResponsibleAdultFormData,
  validationErrors: ValidationResult,
): ResponsibleAdultViewModel => {
  return {
    relationship: {
      value: formData.relationship,
      error: getError(validationErrors, 'relationship'),
    },
    otherRelationshipDetails: {
      value: formData.otherRelationshipDetails,
      error: getError(validationErrors, 'otherRelationshipDetails'),
    },
    fullName: {
      value: formData.fullName,
      error: getError(validationErrors, 'fullName'),
    },
    contactNumber: {
      value: formData.contactNumber || '',
      error: getError(validationErrors, 'contactNumber'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createFromEntity = (responsibleAdult: DeviceWearerResponsibleAdult | null): ResponsibleAdultViewModel => {
  return {
    relationship: {
      value: responsibleAdult?.relationship || '',
    },
    otherRelationshipDetails: {
      value: responsibleAdult?.otherRelationshipDetails || '',
    },
    fullName: {
      value: responsibleAdult?.fullName || '',
    },
    contactNumber: {
      value: responsibleAdult?.contactNumber || '',
    },
    errorSummary: null,
  }
}

const construct = (
  responsibleAdult: DeviceWearerResponsibleAdult | null,
  formData: DeviceWearerResponsibleAdultFormData,
  errors: ValidationResult,
): ResponsibleAdultViewModel => {
  if (errors.length > 0) {
    return constructFromFormData(formData, errors)
  }

  return createFromEntity(responsibleAdult)
}

export default {
  construct,
}
