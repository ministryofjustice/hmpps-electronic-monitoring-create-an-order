import Page, { PageElement } from './page'

import PageHeaderComponent from './components/PageHeaderComponent'

export default class AppPage extends Page {
  header = new PageHeaderComponent()

  constructor(title: string, uri?: string | RegExp, subtitle?: string) {
    super(title, uri, subtitle)
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

  get subNav(): PageElement {
    return cy.get('.moj-sub-navigation')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.header.checkHasHeader()
  }
}
