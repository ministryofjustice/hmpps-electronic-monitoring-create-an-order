import AppFormPage from '../appFormPage'
import { PageElement } from '../page'

export default class AttachmentUploadPage extends AppFormPage {
  constructor() {
    super('Additional documents')
  }

  saveAndContinueButton = (): PageElement =>
    cy.get('form[enctype="multipart/form-data"] button[type=submit][value="continue"]')

  uploadFile = (): AttachmentUploadPage => {
    cy.get('input[type=file]').selectFile('cypress/fixtures/profile.jpeg')
    return this
  }
}
