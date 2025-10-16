import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import SentenceTypeComponent from './SentenceTypeComponent'

export default class SentenceTypePage extends AppFormPage {
  public form = new SentenceTypeComponent()

  constructor() {
    super('', paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.SENTENCE_TYPE)
  }
}
