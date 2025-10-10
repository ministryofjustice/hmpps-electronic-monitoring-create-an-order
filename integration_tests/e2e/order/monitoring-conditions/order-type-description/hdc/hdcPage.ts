import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import HdcComponent from './hdcComponent'

export default class HdcPage extends AppFormPage {
  public form = new HdcComponent()

  constructor() {
    super('', paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HDC)
  }
}
