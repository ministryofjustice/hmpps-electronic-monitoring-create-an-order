import paths from '../../../constants/paths'
import { Order } from '../../../models/Order'
import I18n from '../../../types/i18n'
import QuestionPageContent from '../../../types/i18n/pages/questionPage'

type FindAddressViewModel = {
  content: QuestionPageContent<'postcode' | 'buildingId'>
  manualAddressLink: string
}

const construct = (order: Order, content: I18n): FindAddressViewModel => {
  return {
    content: content.pages.deviceWearerAddress,
    manualAddressLink: paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', order.id).replace(
      ':addressType',
      'device-wearer',
    ),
  }
}

export default { construct }
