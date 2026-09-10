import { PageElement } from '../page'

export default class Task {
  constructor(private readonly name: string) {
    this.element.should('exist')
  }

  get element(): PageElement {
    return cy.get('.govuk-task-list__item').contains('.govuk-task-list__name-and-hint', this.name).parent()
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
