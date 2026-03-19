import { Address } from '../../../models/Address'
import { createAddressPreview } from '../../../utils/utils'

const construct = (addresses: Address[]) => {
  return {
    items: addresses.map((a, index) => ({
      value: index.toString(),
      text: createAddressPreview(a),
    })),
  }
}

export default { construct }
