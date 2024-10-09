import { PageElement } from '../page'

export default class PageHeaderComponent {
  constructor() {
    this.checkHasHeader()
  }

  private get header(): PageElement {
    return cy.get('[role=banner].hmpps-header')
  }

  checkHasHeader(): void {
    this.header.contains('Hmpps Electronic Monitoring Create An Order')
  }

  signOut = (): PageElement => this.header.get('[data-qa=signOut]')

  manageDetails = (): PageElement => this.header.get('[data-qa=manageDetails]')

  userName = (): PageElement => this.header.get('[data-qa=header-user-name]')

  phaseBanner = (): PageElement => this.header.get('[data-qa=header-phase-banner]')
}
