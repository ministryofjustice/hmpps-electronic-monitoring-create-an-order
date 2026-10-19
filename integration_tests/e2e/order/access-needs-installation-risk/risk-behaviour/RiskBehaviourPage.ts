import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import RiskBehaviourComponent, { RISK_BEHAVIOUR_QUESTION } from './RiskBehaviourComponent'

export default class RiskBehaviourPage extends AppFormPage {
  public form = new RiskBehaviourComponent()

  constructor() {
    super(RISK_BEHAVIOUR_QUESTION, paths.INSTALLATION_AND_RISK.RISK_BEHAVIOUR)
  }
}
