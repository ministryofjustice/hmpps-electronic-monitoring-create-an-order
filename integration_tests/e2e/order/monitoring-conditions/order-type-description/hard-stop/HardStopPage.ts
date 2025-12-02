import AppFormPage from '../../../../../pages/appFormPage'
import paths from '../../../../../../server/constants/paths'

export default class HardStopPage extends AppFormPage {
  constructor() {
    super(
      'Device wearer is not eligible for the acquisitive crime pilot',
      paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HARD_STOP,
    )
  }
}
