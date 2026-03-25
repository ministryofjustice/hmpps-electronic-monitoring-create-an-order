import paths from '../../../constants/paths'
import { Address, AddressType } from '../../../models/Address'
import I18n from '../../../types/i18n'
import { AddressResultPageContent } from '../../../types/i18n/pages/postcodeLookup'
import { createAddressPreview } from '../../../utils/utils'

type AddressResultViewModel = {
  items: { value: string; text: string }[]
  searchAgainLink: string
  postcode: string
  addressCount: number
  buildingId?: string
  content: AddressResultPageContent
}

const construct = (
  addresses: Address[],
  content: I18n,
  opts: { orderId: string; addressType: AddressType; postcode?: string; buildingId?: string },
): AddressResultViewModel => {
  const items = addresses.map((a, index) => ({
    value: index.toString(),
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
