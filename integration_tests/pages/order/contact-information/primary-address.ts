import AddressPage from '../../addressPage'

import paths from '../../../../server/constants/paths'

export default class PrimaryAddressPage extends AddressPage {
  constructor() {
    super('Main address', paths.CONTACT_INFORMATION.ADDRESSES, 'Contact information')
  }
}
