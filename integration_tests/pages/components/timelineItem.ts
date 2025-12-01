import { v4 as uuidv4 } from 'uuid'
import { PageElement } from '../page'

export default class TimelineItem {
  private elementCacheId: string = uuidv4()

  constructor(status: string) {
    cy.contains('.moj-timeline__title', status).parents('.moj-timeline__item').as(`${this.elementCacheId}-element`)
    this.element.should('exist')
  }

  get element(): PageElement {
    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  usernameIs(username: string) {
    this.element.get('.moj-timeline__byline').contains(username)
  }

  resultDateIs(time: string) {
    this.element.get('.moj-timeline__date').contains(time)
  }
}
