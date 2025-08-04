import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'
import PhotoQuestionFormComponent from '../../components/forms/attachments/photoQuestionForm'

export default class PhotoQuestionPage extends AppFormPage {
  public form = new PhotoQuestionFormComponent()

  constructor() {
    super('', paths.ATTACHMENT.PHOTO_QUESTION)
  }
}
