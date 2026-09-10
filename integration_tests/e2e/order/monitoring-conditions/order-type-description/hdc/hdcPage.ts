import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import HdcComponent from './hdcComponent'

export default class HdcPage extends AppFormPage {
  public form = new HdcComponent()

  constructor() {
    super(
      'Is the device wearer on a Home Detention Curfew (HDC)?',
      paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HDC,
    )
  }
}
