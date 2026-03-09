import Page, { PageElement } from './page'

import PageHeaderComponent from './components/PageHeaderComponent'

export default class AppPage extends Page {
  protected helpText

  protected section

  header = new PageHeaderComponent()

  constructor(title: string, uri?: string | RegExp, subtitle?: string, helpText?: string, section?: string) {
    super(title, uri, subtitle)
    this.helpText = helpText
    this.section = section
  }

  get backButton(): PageElement {
    return cy.contains('Back')
  }

  get backToSummaryButton(): PageElement {
    return cy.contains('Save and return to main form menu')
  }

  get returnBackToFormSectionMenuButton(): PageElement {
    return cy.contains('Return back to form section menu')
  }

  get submittedBanner(): PageElement {
    return cy.get('.govuk-notification-banner')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.header.checkHasHeader()

    if (this.section) {
      cy.get('.govuk-caption-l', { log: false }).contains(this.section)
    }
  }
}
