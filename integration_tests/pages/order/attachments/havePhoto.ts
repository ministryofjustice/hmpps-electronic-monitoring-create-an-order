import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'
import HavePhotoFormComponent from '../../components/forms/attachments/havePhotoForm'

export default class HavePhotoPage extends AppFormPage {
  public form = new HavePhotoFormComponent()

  constructor() {
    super('', paths.ATTACHMENT.HAVE_PHOTO)
  }
}
