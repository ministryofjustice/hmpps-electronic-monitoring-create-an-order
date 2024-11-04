import AppPage from '../appPage'

import { PageElement } from '../page'

import paths from '../../../server/constants/paths'

export default class AttachmentPage extends AppPage {
  constructor() {
    super('Attach a document', paths.ATTACHMENT.ATTACHMENTS)
  }

  // ACTIONS

  get backToFormSectionButton(): PageElement {
    return cy.contains('Back to form section')
  }
}
