import AppPage from '../appPage'

import { PageElement } from '../page'

import paths from '../../../server/constants/paths'

export default class AttachmentPage extends AppPage {
  constructor() {
    super('Attach a document', paths.ATTACHMENT.ATTACHMENTS)
  }

  // ACTIONS

  get saveAndReturnButton(): PageElement {
    return cy.contains('Save and return back to form section menu')
  }
}
