import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'
import UploadAttachmentFormComponent from '../../components/forms/attachments/uploadAttachmentForm'

export default class UploadLicencePage extends AppFormPage {
  public form = new UploadAttachmentFormComponent()

  constructor() {
    super(
      'Licence',
      paths.ATTACHMENT.FILE_VIEW.replace(':fileType(photo_Id|licence)', 'licence'),
      'Additional documents',
    )
  }
}
