import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import DapolMissedInErrorComponent from './dapolMissedInErrorComponent'

export default class DapolMissedInErrorPage extends AppFormPage {
  public form = new DapolMissedInErrorComponent()

  constructor() {
    super('', paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.DAPOL_MISSED_IN_ERROR)
  }
}
