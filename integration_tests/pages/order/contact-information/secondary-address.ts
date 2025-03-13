import AddressPage from '../../addressPage'

import paths from '../../../../server/constants/paths'

export default class SecondaryAddressPage extends AddressPage {
  constructor() {
    super("Device wearer's second address", paths.CONTACT_INFORMATION.ADDRESSES, 'Contact information')
  }
}
