import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import MonitoringTypesComponent from './MonitoringTypesComponent'

export default class MonitoringTypesPage extends AppFormPage {
  public form = new MonitoringTypesComponent()

  constructor() {
    super('', paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPES_V2)
  }
}
