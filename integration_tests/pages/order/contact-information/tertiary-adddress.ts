import AddressPage from '../../addressPage'

import paths from '../../../../server/constants/paths'

export default class TertiaryAddressPage extends AddressPage {
  constructor() {
    super("Device wearer's third address", paths.CONTACT_INFORMATION.ADDRESSES, 'Contact information', false)
  }
}
