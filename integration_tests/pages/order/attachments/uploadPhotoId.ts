import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'
import UploadAttachmentFormComponent from '../../components/forms/attachments/uploadAttachmentForm'

export default class UploadPhotoIdPage extends AppFormPage {
  public form = new UploadAttachmentFormComponent()

  constructor() {
    super('Additional documents', paths.ATTACHMENT.PHOTO_ID)
  }
}
