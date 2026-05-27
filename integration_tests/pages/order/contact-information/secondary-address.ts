import AddressPage from '../../addressPage'

import paths from '../../../../server/constants/paths'

export default class SecondaryAddressPage extends AddressPage {
  constructor(section: string = 'About the device wearer') {
    super("Device wearer's second address", paths.CONTACT_INFORMATION.ADDRESSES, section)
  }
}
