import paths from '../../../constants/paths'
import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import I18n from '../../../types/i18n'
import PostcodeLookupPageContent from '../../../types/i18n/pages/postcodeLookup'
import QuestionPageContent from '../../../types/i18n/pages/questionPage'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { FindAddress } from './formModel'

export type AddressType = 'device-wearer' | 'tag-at-source' | 'curfew' | 'appointment'

type FindAddressViewModel = ViewModel<FindAddress> & {
  content: QuestionPageContent<'postcode' | 'buildingId'>
  manualAddressLink: string
}

const construct = (
  order: Order,
  content: I18n,
  errors: ValidationResult,
  addressType: AddressType,
): FindAddressViewModel => {
  return {
    postcode: {
      value: '',
      error: getError(errors, 'postcode'),
    },
    content: getContent(content, addressType),
    manualAddressLink: paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', order.id).replace(
      ':addressType',
      addressType,
    ),
    errorSummary: createGovukErrorSummary(errors),
  }
}

function getContent(content: I18n, addressType: AddressType): PostcodeLookupPageContent {
  const mapping: Record<AddressType, PostcodeLookupPageContent> = {
    'device-wearer': content.pages.deviceWearerAddress,
    'tag-at-source': content.pages.tagAtSourceAddress,
    curfew: content.pages.curfewAddress,
    appointment: content.pages.appointmentAddress,
  }

  return mapping[addressType]
}

export default { construct }
