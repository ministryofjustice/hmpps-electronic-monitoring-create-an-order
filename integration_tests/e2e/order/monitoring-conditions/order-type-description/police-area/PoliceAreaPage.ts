import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import PoliceArea from './PoliceAreaComponent'

export default class PoliceAreaPage extends AppFormPage {
  public form = new PoliceArea()

  constructor() {
    super(
      "Which police force area is the device wearer's release address in?",
      paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.POLICE_AREA,
    )
  }
}
