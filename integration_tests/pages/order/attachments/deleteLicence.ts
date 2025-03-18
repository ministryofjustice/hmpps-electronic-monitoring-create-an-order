import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'
import DeleteAttachmentFormComponent from '../../components/forms/attachments/deleteAttachmentForm'

export default class DeletePhotoIdPageDeleteLicencePage extends AppFormPage {
  public form = new DeleteAttachmentFormComponent()

  constructor() {
    super(
      'Are you sure that you want to delete this document?',
      paths.ATTACHMENT.DELETE_FILE.replace(':fileType(photo_Id|licence)', 'licence'),
      'Additional documents',
    )
  }
}
