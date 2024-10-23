import Page, { PageElement } from './page'

import PageHeaderComponent from './components/PageHeaderComponent'

export default class AppPage extends Page {
  header = new PageHeaderComponent()

  constructor(title: string, uri?: string | RegExp, subtitle?: string) {
    super(title, uri, subtitle)
  }

  get backToSummaryButton(): PageElement {
    return cy.contains('Back')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.header.checkHasHeader()
  }

  submittedBanner = (): PageElement => cy.get('.govuk-notification-banner')
}
