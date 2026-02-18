import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import PilotComponent from './PilotComponent'

export default class PilotPage extends AppFormPage {
  public form = new PilotComponent()

  constructor() {
    super('What pilot project is the device wearer part of?', paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PILOT)
  }
}
