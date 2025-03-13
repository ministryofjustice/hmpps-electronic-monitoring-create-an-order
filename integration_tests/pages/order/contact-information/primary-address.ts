import AddressPage from '../../addressPage'

import paths from '../../../../server/constants/paths'

export default class PrimaryAddressPage extends AddressPage {
  constructor() {
    super('Fixed address', paths.CONTACT_INFORMATION.ADDRESSES, 'Contact information')
  }
}
