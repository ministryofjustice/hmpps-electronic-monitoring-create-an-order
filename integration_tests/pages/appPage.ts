import PageHeaderComponent from './components/PageHeaderComponent'
import Page, { PageElement } from './page'

export default class AppPage extends Page {
  header: PageHeaderComponent

  constructor(title: string, uri?: string | RegExp, subtitle?: string) {
    super(title, uri, subtitle)

    this.header = new PageHeaderComponent()
  }

  get backToSummaryButton(): PageElement {
    return cy.contains('Back')
  }

  submittedBanner = (): PageElement => cy.get('.govuk-notification-banner')
}
