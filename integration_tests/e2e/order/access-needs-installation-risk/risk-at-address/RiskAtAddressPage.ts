import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import RiskAtAddressComponent from './RiskAtAddressComponent'

export default class RiskAtAddressPage extends AppFormPage {
  public form = new RiskAtAddressComponent()

  constructor() {
    super('WIP Risk at address', paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS)
  }
}
