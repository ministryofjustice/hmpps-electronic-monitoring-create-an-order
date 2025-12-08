import { v4 as uuidv4 } from 'uuid'
import { PageElement } from '../page'
import TimelineItem from './timelineItem'

export default class Timeline {
  private elementCacheId: string = uuidv4()

  constructor() {
    cy.get('.moj-timeline').as(`${this.elementCacheId}-element`)
    this.element.should('exist')
  }

  get element(): PageElement {
    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  get formSubmittedComponent(): TimelineItem {
    return new TimelineItem('Form submitted')
  }

  get formFailedComponent(): TimelineItem {
    return new TimelineItem('Failed to submit')
  }

  get formRejectedComponent(): TimelineItem {
    return new TimelineItem('Order rejected')
  }

  get formVariationComponent(): TimelineItem {
    return new TimelineItem('Changes submitted')
  }
}
