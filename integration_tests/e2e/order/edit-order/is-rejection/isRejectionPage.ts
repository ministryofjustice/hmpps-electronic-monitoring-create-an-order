import AppFormPage from '../../../../pages/appFormPage'
import paths from '../../../../../server/constants/paths'
import IsRejectionFormComponent from './IsRejectionFormComponent'

export default class IsRejectionPage extends AppFormPage {
  public form = new IsRejectionFormComponent()

  constructor() {
    super('', paths.ORDER.IS_REJECTION)
  }
}
