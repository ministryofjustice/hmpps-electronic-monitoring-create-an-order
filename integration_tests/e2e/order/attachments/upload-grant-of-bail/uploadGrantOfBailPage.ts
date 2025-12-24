import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import UploadAttachmentFormComponent from '../../../../pages/components/forms/attachments/uploadAttachmentForm'

export default class UploadGrantOfBailPage extends AppFormPage {
  public form = new UploadAttachmentFormComponent()

  constructor() {
    super(
      '',
      paths.ATTACHMENT.FILE_VIEW.replace(':fileType(photo_Id|licence|court_order|grant_of_bail)', 'grant_of_bail'),
      'Additional documents',
    )
  }
}
