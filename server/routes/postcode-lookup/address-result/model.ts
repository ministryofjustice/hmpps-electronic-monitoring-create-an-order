import { Address } from '../../../models/Address'
import { createAddressPreview } from '../../../utils/utils'

type AddressResultViewModel = {
  items: { value: string; text: string }[]
  postcode: string
  addressCount: number
}

const construct = (addresses: Address[], opts: { postcode?: string } = {}): AddressResultViewModel => {
  const items = addresses.map((a, index) => ({
    value: index.toString(),
    text: createAddressPreview(a),
  }))

  return {
    items,
    postcode: opts.postcode || '',
    addressCount: items.length,
  }
}

export default { construct }
