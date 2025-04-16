import { v4 as uuidv4 } from 'uuid'
import { PageElement } from '../page'

export default class Task {
  private elementCacheId: string = uuidv4()

  constructor(private readonly name: string) {}

  get element(): PageElement {
    return cy.get('.govuk-task-list__item')
      .contains('.govuk-task-list__name-and-hint', this.name)
      .parent()
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

  shouldExist() {
    this.element.should('exist')
  }

  shouldNotExist() {
    this.element.should('not.exist')
  }

  shouldHaveStatus(value: string): void {
    this.status.should('contain', value)
  }

  shouldNotHaveStatus(): void {
    this.status.find('.govuk-tag').should('have.length', 0)
  }
}
