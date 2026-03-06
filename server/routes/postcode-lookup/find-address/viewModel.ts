import paths from '../../../constants/paths'
import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import I18n from '../../../types/i18n'
import QuestionPageContent from '../../../types/i18n/pages/questionPage'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { FindAddress } from './formModel'

type FindAddressViewModel = ViewModel<FindAddress> & {
  content: QuestionPageContent<'postcode' | 'buildingId'>
  manualAddressLink: string
}

const construct = (order: Order, content: I18n, errors: ValidationResult): FindAddressViewModel => {
  return {
    postcode: {
      value: '',
      error: getError(errors, 'postcode'),
    },
    content: content.pages.deviceWearerAddress,
    manualAddressLink: paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', order.id).replace(
      ':addressType',
      'device-wearer',
    ),
    errorSummary: createGovukErrorSummary(errors),
  }
}

export default { construct }
