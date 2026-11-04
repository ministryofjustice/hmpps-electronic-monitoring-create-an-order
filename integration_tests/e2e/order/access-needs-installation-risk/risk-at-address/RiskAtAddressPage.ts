import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import RiskAtAddressComponent, { RISK_AT_ADDRESS_QUESTION } from './RiskAtAddressComponent'

export default class RiskAtAddressPage extends AppFormPage {
  public form = new RiskAtAddressComponent()

  constructor() {
    super(RISK_AT_ADDRESS_QUESTION, paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS)
  }
}
