import AddressPage from '../../addressPage'

import paths from '../../../../server/constants/paths'

export default class PrimaryAddressPage extends AddressPage {
  constructor(section: string = 'About the device wearer') {
    super('Main address', paths.CONTACT_INFORMATION.ADDRESSES, section)
  }
}
