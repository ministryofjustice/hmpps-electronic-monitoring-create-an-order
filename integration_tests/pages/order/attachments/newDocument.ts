import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'
import NewDocumentFormComponent from '../../components/forms/attachments/newDocumentForm'

export default class NewDocumentPage extends AppFormPage {
  public form = new NewDocumentFormComponent()

  constructor() {
    super('', paths.ATTACHMENT.NEW_DOCUMENT)
  }
}
