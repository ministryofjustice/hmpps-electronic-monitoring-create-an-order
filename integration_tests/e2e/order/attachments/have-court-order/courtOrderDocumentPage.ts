import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import CourtOrderDocumentFormComponent from './courtOrderDocumentComponent'

export default class CourtOrderDocumentPage extends AppFormPage {
  public form = new CourtOrderDocumentFormComponent()

  constructor() {
    super('', paths.ATTACHMENT.HAVE_COURT_ORDER)
  }
}
