import paths from '../../../constants/paths'
import { AddressType, AddressWithUPRN } from '../../../models/Address'
import { ValidationResult } from '../../../models/Validation'
import { ErrorMessage } from '../../../models/view-models/utils'
import I18n from '../../../types/i18n'
import { AddressResultPageContent } from '../../../types/i18n/pages/postcodeLookup'
import { createGovukErrorSummary } from '../../../utils/errors'
import { ErrorSummary } from '../../../utils/govukFrontEndTypes/errorSummary'
import { createAddressPreview, getError } from '../../../utils/utils'

type AddressResultViewModel = {
  items: { value: string; text: string }[]
  searchAgainLink: string
  postcode: string
  addressCount: number
  buildingId?: string
  content: AddressResultPageContent
  manualAddressLink: string
  addressError?: ErrorMessage
  errorSummary: ErrorSummary | null
}

const construct = (
  addresses: AddressWithUPRN[],
  content: I18n,
  errors: ValidationResult,
  opts: { orderId: string; addressType: AddressType; postcode?: string; buildingId?: string },
): AddressResultViewModel => {
  const items = addresses.map(a => ({
    value: a.uprn.toString(),
    text: createAddressPreview(a),
  }))

  return {
    items,
    searchAgainLink: paths.POSTCODE_LOOKUP.FIND_ADDRESS.replace(':orderId', opts.orderId).replace(
      ':addressType',
      opts.addressType,
    ),
    postcode: opts.postcode || '',
    addressCount: items.length,
    buildingId: opts.buildingId,
    content: getContent(content, opts.addressType),
    manualAddressLink: paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', opts.orderId).replace(
      ':addressType',
      opts.addressType,
    ),
    addressError: getError(errors, 'address'),
    errorSummary: createGovukErrorSummary(errors),
  }
}

function getContent(content: I18n, addressType: AddressType): AddressResultPageContent {
  const mapping: Record<AddressType, AddressResultPageContent> = {
    PRIMARY: content.pages.deviceWearerAddressResult,
    INSTALLATION: content.pages.tagAtSourceAddressResult,
    TERTIARY: content.pages.curfewAddressResult,
    SECONDARY: content.pages.curfewAddressResult,

    // These are also not used currently, can potentially be removed
    RESPONSIBLE_ADULT: content.pages.deviceWearerAddressResult,
    RESPONSIBLE_ORGANISATION: content.pages.deviceWearerAddressResult,
    // Currently, mandatory attendence monitoring address is not stored as a separate address
    // appointment: content.pages.appointmentAddress,
  }

  return mapping[addressType]
}

export default { construct }
