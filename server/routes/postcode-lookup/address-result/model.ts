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
    // TODO: dynamic content
    content: content.pages.deviceWearerAddressResult,
  }
}

export default { construct }
