import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import RiskBehaviourComponent from './RiskBehaviourComponent'

export default class RiskBehaviourPage extends AppFormPage {
  public form = new RiskBehaviourComponent()

  constructor() {
    super('WIP Risk behaviour', paths.INSTALLATION_AND_RISK.RISK_BEHAVIOUR)
  }
}
