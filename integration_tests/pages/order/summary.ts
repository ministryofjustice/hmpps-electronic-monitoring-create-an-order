import Page, { PageElement } from '../page'

export default class IndexPage extends Page {
  constructor() {
    super('Apply for electronic monitoring')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')

  orderSections = (): PageElement => cy.get('.govuk-task-list')

  orderSectionsItems = (): PageElement => cy.get('govuk-task-list li')

  submissionForm = (): PageElement => cy.get('form[action*="submit"]')

  submissionFormButton = (): PageElement => cy.get('form[action*="submit"] button[type=submit]')

  backToSearchButton = (): PageElement => cy.get('a#backToSearch[href="/"]')
}
