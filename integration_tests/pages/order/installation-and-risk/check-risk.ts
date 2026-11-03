import paths from '../../../../server/constants/paths'
import AppFormPage from '../../appFormPage'
import CheckRiskComponent, { CHECK_RISK_QUESTION } from './CheckRiskComponent'

export default class InstallationAndRiskCheckRiskPage extends AppFormPage {
  public form = new CheckRiskComponent()

  constructor(section: string = 'Access needs and installation risk') {
    super(CHECK_RISK_QUESTION, paths.INSTALLATION_AND_RISK.CHECK_RISK, section)
  }
}
