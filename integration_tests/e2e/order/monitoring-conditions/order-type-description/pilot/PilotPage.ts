import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import PilotComponent from './PilotComponent'

export default class OrderTypePage extends AppFormPage {
  public form = new PilotComponent()

  constructor() {
    super('', paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PILOT)
  }
}
