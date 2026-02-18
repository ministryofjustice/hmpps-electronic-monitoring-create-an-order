import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import MonitoringTypesComponent from './MonitoringTypesComponent'

export default class MonitoringTypePage extends AppFormPage {
  public form = new MonitoringTypesComponent()

  constructor() {
    super(
      'What monitoring does the device wearer need?',
      paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPE,
    )
  }
}
