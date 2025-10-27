import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import MonitoringDatesComponent from './MonitoringDatesComponent'

export default class MonitoringDatesPage extends AppFormPage {
  public form = new MonitoringDatesComponent()

  constructor() {
    super('', paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_DATES)
  }
}
