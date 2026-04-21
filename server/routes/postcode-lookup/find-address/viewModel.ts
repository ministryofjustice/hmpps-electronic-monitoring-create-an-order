import paths from '../../../constants/paths'
import { AddressType } from '../../../models/Address'
import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import I18n from '../../../types/i18n'
import PostcodeLookupPageContent from '../../../types/i18n/pages/postcodeLookup'
import QuestionPageContent from '../../../types/i18n/pages/questionPage'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { FindAddress, FindAddressForm } from './formModel'

type FindAddressViewModel = ViewModel<FindAddress> & {
  content: QuestionPageContent<'postcode' | 'buildingId'>
  manualAddressLink: string
}

const construct = (
  order: Order,
  content: I18n,
  errors: ValidationResult,
  addressType: AddressType,
  formData: FindAddressForm | undefined,
): FindAddressViewModel => {
  return {
    postcode: {
      value: formData?.postcode || '',
      error: getError(errors, 'postcode'),
    },
    buildingId: {
      value: formData?.buildingId || '',
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
    PRIMARY: content.pages.deviceWearerAddress,
    INSTALLATION: content.pages.tagAtSourceAddress,
    TERTIARY: content.pages.curfewAddress,
    SECONDARY: content.pages.curfewAddress,

    // These are also not used currently, can potentially be removed
    RESPONSIBLE_ADULT: content.pages.deviceWearerAddress,
    RESPONSIBLE_ORGANISATION: content.pages.deviceWearerAddress,
    // Currently, mandatory attendence monitoring address is not stored as a separate address
    // appointment: content.pages.appointmentAddress,
  }

  return mapping[addressType]
}

export default { construct }
