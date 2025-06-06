import AddressPage from '../../addressPage'

import paths from '../../../../server/constants/paths'

export default class InstallationAddressPage extends AddressPage {
  constructor() {
    super(
      'Installation address',
      paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS,
      'Electronic monitoring required',
      false,
    )
  }
}
