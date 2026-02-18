import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import TypesOfMonitoringNeededComponent from './TypesOfMonitoringNeededComponent'

export default class TypesOfMonitoringNeededPage extends AppFormPage {
  public form = new TypesOfMonitoringNeededComponent()

  constructor() {
    super('Types of monitoring needed', paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.TYPES_OF_MONITORING_NEEDED)
  }
}
