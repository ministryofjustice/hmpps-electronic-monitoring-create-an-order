import AddressPage from '../../addressPage'

import paths from '../../../../server/constants/paths'

export default class TertiaryAddressPage extends AddressPage {
  constructor() {
    super('Contact information', paths.CONTACT_INFORMATION.ADDRESSES, 'Tertiary address', false)
  }
}
