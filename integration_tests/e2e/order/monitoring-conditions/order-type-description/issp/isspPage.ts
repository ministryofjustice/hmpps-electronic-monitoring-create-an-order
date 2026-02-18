import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import IsspComponent from './isspComponent'

export default class IsspPage extends AppFormPage {
  public form = new IsspComponent()

  constructor() {
    super('', paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ISSP)
  }
}
