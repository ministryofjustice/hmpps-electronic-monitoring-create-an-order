import Page, { PageElement } from '../page'

export default class AttachmentPage extends Page {
  constructor() {
    super('Attach a document')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')
}