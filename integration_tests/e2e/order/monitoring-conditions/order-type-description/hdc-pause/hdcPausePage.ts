import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import HdcPauseComponent from './hdcPauseComponent'

export default class HdcPausePage extends AppFormPage {
  public form = new HdcPauseComponent()

  constructor() {
    super('', paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HDC_PAUSE)
  }
}
