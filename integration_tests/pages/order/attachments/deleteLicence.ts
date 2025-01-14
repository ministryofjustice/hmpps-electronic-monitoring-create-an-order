import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'
import DeleteAttachmentFormComponent from '../../components/forms/attachments/deleteAttachmentForm'

export default class DeletePhotoIdPageDeleteLicencePage extends AppFormPage {
  public form = new DeleteAttachmentFormComponent()

  constructor() {
    super('Are you sure you want to delete this licence?', paths.ATTACHMENT.DELETE_LICENCE)
  }
}
