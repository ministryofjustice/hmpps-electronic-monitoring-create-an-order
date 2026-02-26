import { createGovukErrorSummary } from '../../utils/errors'
import { convertBooleanToEnum, getError } from '../../utils/utils'
import { ContactDetails } from '../ContactDetails'
import { ContactDetailsFormData } from '../form-data/contactDetails'
import { ValidationResult } from '../Validation'
import { ViewModel } from './utils'

type ContactDetailsViewModel = ViewModel<NonNullable<ContactDetails>>

const constructFromFormData = (
  formData: ContactDetailsFormData,
  validationErrors: ValidationResult,
): ContactDetailsViewModel => {
  return {
    contactNumber: {
      value: formData.contactNumber || '',
      error: getError(validationErrors, 'contactNumber'),
    },
    phoneNumberAvailable: {
      value: formData.phoneNumberAvailable || '',
      error: getError(validationErrors, 'phoneNumberAvailable'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const constructFromEntity = (contactDetails: ContactDetails): ContactDetailsViewModel => {
  if (contactDetails) {
    return {
      contactNumber: {
        value: contactDetails.contactNumber ?? '',
      },
      phoneNumberAvailable: {
        value: convertBooleanToEnum(contactDetails.phoneNumberAvailable, '', 'true', 'false'),
      },
      errorSummary: null,
    }
  }
  return {
    contactNumber: {
      value: '',
    },
    phoneNumberAvailable: {
      value: '',
    },
    errorSummary: null,
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
