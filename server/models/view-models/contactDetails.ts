import { DeviceWearerContactDetails } from '../DeviceWearerContactDetails'
import { ViewModel } from './utils'
import { ContactDetailsFormData } from '../form-data/contactDetails'
import { ValidationResult } from '../Validation'
import { getError } from '../../utils/utils'

type ContactDetailsViewModel = ViewModel<DeviceWearerContactDetails>

const constructFromFormData = (formData: ContactDetailsFormData, validationErrors: ValidationResult) => {
  return {
    contactNumber: {
      value: formData.contactNumber || '',
      error: getError(validationErrors, 'contactNumber'),
    },
  }
}

const constructFromEntity = (contactDetails: DeviceWearerContactDetails) => {
  return {
    contactNumber: {
      value: contactDetails.contactNumber || '',
    },
  }
}

const construct = (
  contactDetails: DeviceWearerContactDetails,
  formData: ContactDetailsFormData,
  validationErrors: ValidationResult,
): ContactDetailsViewModel => {
  if (validationErrors.length > 0) {
    return constructFromFormData(formData, validationErrors)
  }

  return constructFromEntity(contactDetails)
}

export default {
  construct,
}
