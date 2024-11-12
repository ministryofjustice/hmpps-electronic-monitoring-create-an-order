import { getError } from '../../utils/utils'
import { ContactDetails } from '../ContactDetails'
import { ContactDetailsFormData } from '../form-data/contactDetails'
import { ValidationResult } from '../Validation'
import { ViewModel } from './utils'

type ContactDetailsViewModel = ViewModel<NonNullable<ContactDetails>>

const constructFromFormData = (formData: ContactDetailsFormData, validationErrors: ValidationResult) => {
  return {
    contactNumber: {
      value: formData.contactNumber || '',
      error: getError(validationErrors, 'contactNumber'),
    },
  }
}

const constructFromEntity = (contactDetails: ContactDetails) => {
  if (contactDetails) {
    return {
      contactNumber: {
        value: contactDetails.contactNumber ?? '',
      },
    }
  }
  return {
    contactNumber: {
      value: '',
    },
  }
}

const construct = (
  contactDetails: ContactDetails,
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
