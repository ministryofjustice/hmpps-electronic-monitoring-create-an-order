import AppFormPage from '../../appFormPage'

import { PageElement } from '../../page'

import paths from '../../../../server/constants/paths'
import AttachmentTask from '../../components/attachmentsTask'

export default class AttachmentSummaryPage extends AppFormPage {
  constructor() {
    super('Check your answers', paths.ATTACHMENT.ATTACHMENTS, 'Additional documents')
  }

  get licenceTask(): AttachmentTask {
    return new AttachmentTask('Upload a copy of the licence or court order document')
  }

  get photoIdTask(): AttachmentTask {
    return new AttachmentTask('Upload a photo of the device wearer (optional)')
  }

  // ACTIONS
  get saveAndReturnButton(): PageElement {
    return cy.contains('Save and return to main form menu')
  }
}
