import AddressPage from '../../addressPage'

import paths from '../../../../server/constants/paths'

export default class InstallationAddressPage extends AddressPage {
  constructor() {
    super('Monitoring Conditions', paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS, 'Installation address', false)
  }
}