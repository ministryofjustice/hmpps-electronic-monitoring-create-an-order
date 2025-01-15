import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'
import UploadAttachmentFormComponent from '../../components/forms/attachments/uploadAttachmentForm'

export default class UploadLicencePage extends AppFormPage {
  public form = new UploadAttachmentFormComponent()

  constructor() {
    super('Additional documents', paths.ATTACHMENT.FILE_VIEW.replace(':fileType', 'licence'))
  }
}
