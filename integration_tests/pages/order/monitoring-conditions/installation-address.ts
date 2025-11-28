import AddressPage from '../../addressPage'

import paths from '../../../../server/constants/paths'

export default class InstallationAddressPage extends AddressPage {
  constructor() {
    super(
      'At what address will installation of the electronic monitoring device take place?',
      paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS,
      'Electronic monitoring required',
      false,
    )
  }
}
