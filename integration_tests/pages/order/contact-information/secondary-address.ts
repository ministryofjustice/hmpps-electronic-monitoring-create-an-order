import AddressPage from '../../addressPage'

import paths from '../../../../server/constants/paths'

export default class SecondaryAddressPage extends AddressPage {
  constructor() {
    super('Contact information', paths.CONTACT_INFORMATION.ADDRESSES, 'Secondary address')
  }
}
