import { v4 as uuidv4 } from 'uuid'

import { PageElement } from '../page'

export default class PageHeaderComponent {
  private elementCacheId: string = uuidv4()

  constructor() {
    cy.get('[role=banner].hmpps-header', { log: false }).as(`${this.elementCacheId}-element`)
    this.element.should('exist')
  }

  get element(): PageElement {
    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  checkHasHeader(): void {
    this.element.contains('Hmpps Electronic Monitoring Create An Order', { log: false })
  }

  signOut = (): PageElement => this.element.get('[data-qa=signOut]')

  manageDetails = (): PageElement => this.element.get('[data-qa=manageDetails]')

  userName = (): PageElement => this.element.get('[data-qa=header-user-name]')

  phaseBanner = (): PageElement => this.element.get('[data-qa=header-phase-banner]')
}
