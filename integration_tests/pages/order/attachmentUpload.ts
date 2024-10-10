import AppPage from '../appPage'
import { PageElement } from '../page'

export default class AttachmentUploadPage extends AppPage {
  constructor() {
    super('Additional documents')
  }

  saveAndContinueButton = (): PageElement =>
    cy.get('form[enctype="multipart/form-data"] button[type=submit][value="continue"]')

  backToSummaryButton = (): PageElement => cy.get('a#backToSummary')

  uploadFile = (): AttachmentUploadPage => {
    cy.get('input[type=file]').selectFile('cypress/fixtures/profile.jpeg')
    return this
  }
}
