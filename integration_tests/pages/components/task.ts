import { v4 as uuidv4 } from 'uuid'
import { PageElement } from '../page'

export default class Task {
  private elementCacheId: string = uuidv4()

  constructor(private readonly name: string) {
    const nameToSearch = this.name.trim()
    cy.contains('a.govuk-link.govuk-task-list__link', nameToSearch, { log: false })
      .parents('li.govuk-task-list__item.govuk-task-list__item--with-link')
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

  shouldNotHaveStatus(): void {
    this.status.find('.govuk-tag').should('have.length', 0)
  }
}
