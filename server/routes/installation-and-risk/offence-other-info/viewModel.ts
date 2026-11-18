import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/validation/errors'
import { OffenceOtherInfoInput } from './formModel'
import { getError } from '../../../utils/validation/errorMessages'

type OffenceOtherInfoViewModel = ViewModel<
  Pick<OffenceOtherInfoInput, 'hasOtherInformation' | 'otherInformationDetails'>
>

const constructFromFormData = (
  formData: OffenceOtherInfoInput,
  errors: ValidationResult,
): OffenceOtherInfoViewModel => {
  return {
    hasOtherInformation: {
      value: formData.hasOtherInformation ?? '',
      error: getError(errors, 'hasOtherInformation'),
    },
    otherInformationDetails: {
      value: formData.otherInformationDetails ?? '',
      error: getError(errors, 'otherInformationDetails'),
    },
    errorSummary: createGovukErrorSummary(errors),
  }
}

const constructFromOrder = (order: Order): OffenceOtherInfoViewModel => {
  const details = order.offenceAdditionalDetails?.additionalDetails
  if (details?.trim()) {
    return {
      hasOtherInformation: {
        value: 'yes',
      },
      otherInformationDetails: {
        value: details,
      },
      errorSummary: null,
    }
  }

  return {
    hasOtherInformation: {
      value: '',
    },
    otherInformationDetails: {
      value: '',
    },
    errorSummary: null,
  }
}

const construct = (
  order: Order,
  formData: OffenceOtherInfoInput | undefined,
  errors: ValidationResult,
): OffenceOtherInfoViewModel => {
  if (errors.length > 0 && formData) {
    return constructFromFormData(formData, errors)
  }

  return constructFromOrder(order)
}

export default {
  construct,
}
