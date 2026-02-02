import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { OffenceOtherInfoInput } from './formModel'

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
  if (order.offenceAdditionalDetails) {
    const details = order.offenceAdditionalDetails.additionalDetails ?? ''

    return {
      hasOtherInformation: {
        value: details.length > 0 ? 'yes' : 'no',
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
