import Page, { PageElement } from '../page'

export default class AttachmentUploadPage extends Page {
  constructor() {
    super('Additional documents')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')

  saveAndContinueButton = (): PageElement =>
    cy.get('form[enctype="multipart/form-data"] button[type=submit][value="continue"]')

  backToSummaryButton = (): PageElement => cy.get('a#backToSummary')

  uploadFile = (): AttachmentUploadPage => {
    cy.get('input[type=file]').selectFile('cypress/fixtures/profile.jpeg')
    return this
  }
}
