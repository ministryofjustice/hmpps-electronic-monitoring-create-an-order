import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import PrarrComponent from './PrarrComponent'

export default class PrarrPage extends AppFormPage {
  public form = new PrarrComponent()

  constructor() {
    super('', paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR)
  }
}
