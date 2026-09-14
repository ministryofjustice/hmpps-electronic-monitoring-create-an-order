import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import PrarrComponent from './PrarrComponent'

export default class PrarrPage extends AppFormPage {
  public form = new PrarrComponent()

  constructor() {
    super(
      'Has the device wearer been released on a Presumptive Risk Assessed Release Review (P-RARR)?',
      paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR,
    )
  }
}
