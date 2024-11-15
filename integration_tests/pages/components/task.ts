import { v4 as uuidv4 } from 'uuid'
import { PageElement } from '../page'

export default class Task {
  private elementCacheId: string = uuidv4()

  constructor(private readonly name: string) {
    cy.get('.govuk-task-list__item')
      .contains('.govuk-task-list__name-and-hint', this.name)
      .parent()
      .as(`${this.elementCacheId}-element`)
    this.element.should('exist')
  }

  get element(): PageElement {
    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  get status(): PageElement {
    return this.element.find('.govuk-task-list__status')
  }

  get link(): PageElement {
    return this.element.find('a')
  }

  click(): void {
    this.link.click()
  }

  shouldHaveStatus(value: string): void {
    this.status.should('contain', value)
  }

  shouldBeDisabled(): void {
    this.link.should('not.exist')
  }

  shouldBeEnabled(): void {
    this.link.should('exist')
  }
}
