import Page, { PageElement } from './page'

import PageHeaderComponent from './components/PageHeaderComponent'

export default class AppPage extends Page {
  protected helpText

  header = new PageHeaderComponent()

  constructor(title: string, uri?: string | RegExp, subtitle?: string, helpText?: string) {
    super(title, uri, subtitle)
    this.helpText = helpText
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
  }
}
