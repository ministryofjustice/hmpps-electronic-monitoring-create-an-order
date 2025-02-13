import { govukErrorSummary } from '../../utils/errors'
import { getError } from '../../utils/utils'
import { ContactDetails } from '../ContactDetails'
import { ContactDetailsFormData } from '../form-data/contactDetails'
import { Order } from '../Order'
import { ValidationResult } from '../Validation'
import { AppFormPage } from './utils'

const construct = (
  order: Order,
  formData: ContactDetailsFormData,
  validationErrors: ValidationResult,
): AppFormPage<ContactDetails> => {
  const contactNumber =
    validationErrors.length > 0 ? formData.contactNumber || '' : (order.contactDetails?.contactNumber ?? '')

  return {
    errorSummary: govukErrorSummary(validationErrors),
    fields: {
      contactNumber: {
        component: 'govukInput',
        args: {
          label: {
            text: 'Enter a telephone number we can use to contact the device wearer (optional).',
          },
          hint: {
            text: 'Provide either a landline or mobile number',
          },
          classes: 'govuk-!-width-two-thirds',
          id: 'contactNumber',
          name: 'contactNumber',
          type: 'tel',
          value: contactNumber,
          errorMessage: getError(validationErrors, 'contactNumber'),
          disabled: order.status === 'SUBMITTED',
        },
      },
    },
  }
}

export default {
  construct,
}
