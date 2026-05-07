import AddressPage from '../../addressPage'

import paths from '../../../../server/constants/paths'

export default class TertiaryAddressPage extends AddressPage {
  constructor(section: string = 'Contact information') {
    super("Device wearer's third address", paths.CONTACT_INFORMATION.ADDRESSES, section, false)
  }
}
