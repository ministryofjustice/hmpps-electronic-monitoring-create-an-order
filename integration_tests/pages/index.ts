import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('Electronic Monitoring Order')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')

  newFormButton = (): PageElement => cy.get('a:contains("New Form")')

  searchInput = (): PageElement => cy.get('#keyword')

  searchButton = (): PageElement => cy.get('button:contains("Search")')

  formTable = (): PageElement => cy.get('#formList')

  formRow = (): PageElement => cy.get('.govuk-task-list').find('.govuk-task-list__item')
}
