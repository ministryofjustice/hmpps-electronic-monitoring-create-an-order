import PageHeaderComponent from './components/PageHeaderComponent'
import Page, { PageElement } from './page'

export default class AppPage extends Page {
  header: PageHeaderComponent

  constructor(title: string, subtitle?: string) {
    super(title, subtitle)
    this.header = new PageHeaderComponent()
  }

  submittedBanner = (): PageElement => cy.get('.govuk-notification-banner')
}
