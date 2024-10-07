import Page, { PageElement } from '../page'

export default class InstallationAndRiskPage extends Page {
  constructor() {
    super('Installation and risk information')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')

  form = (): PageElement => cy.get('form')

  saveAndContinueButton = (): PageElement => cy.get('form button[type=submit][value="continue"]')

  saveAndReturnButton = (): PageElement => cy.get('form button[type=submit][value="back"]')

  backToSummaryButton = (): PageElement => cy.get('a#backToSummary')
}
