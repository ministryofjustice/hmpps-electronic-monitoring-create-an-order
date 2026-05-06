import AddressPage from '../../addressPage'

import paths from '../../../../server/constants/paths'

export default class SecondaryAddressPage extends AddressPage {
  constructor(section: string = 'Contact information') {
    super("Device wearer's second address", paths.CONTACT_INFORMATION.ADDRESSES, section)
  }
}
