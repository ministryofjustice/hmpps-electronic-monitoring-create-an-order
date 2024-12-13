import { v4 as uuidv4 } from 'uuid'

import { PageElement } from '../page'

export default class FormDateComponent {
  private elementCacheId: string = uuidv4()

  constructor(
    private readonly parent: PageElement,
    private readonly label: string,
  ) {
    this.parent.getByLegend(this.label, { log: false }).as(`${this.elementCacheId}-element`)
    this.element.should('exist')

    this.element.getByLabel('Day', { log: false }).as(`${this.elementCacheId}-day`)
    this.element.getByLabel('Month', { log: false }).as(`${this.elementCacheId}-month`)
    this.element.getByLabel('Year', { log: false }).as(`${this.elementCacheId}-year`)
  }

  get element(): PageElement {
    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  get day(): PageElement {
    return cy.get(`@${this.elementCacheId}-day`, { log: false })
  }

  setDay(value: string) {
    this.day.type(value)
  }

  get month(): PageElement {
    return cy.get(`@${this.elementCacheId}-month`, { log: false })
  }

  setMonth(value: string) {
    this.month.type(value)
  }

  get year(): PageElement {
    return cy.get(`@${this.elementCacheId}-year`, { log: false })
  }

  setYear(value: string) {
    this.year.type(value)
  }

  set(value: Date) {
    this.setDay(`0${value.getDate()}`.slice(-2))
    this.setMonth(`0${value.getMonth() + 1}`.slice(-2))
    this.setYear(`${value.getFullYear()}`)
  }

  shouldHaveValue(value: Date): void {
    this.day.should('have.value', `0${value.getDate()}`.slice(-2))
    this.month.should('have.value', `0${value.getMonth() + 1}`.slice(-2))
    this.year.should('have.value', `${value.getFullYear()}`)
  }

  shouldBeDisabled(): void {
    this.day.should('be.disabled')
    this.month.should('be.disabled')
    this.year.should('be.disabled')
  }

  shouldNotBeDisabled(): void {
    this.day.should('not.be.disabled')
    this.month.should('not.be.disabled')
    this.year.should('not.be.disabled')
  }

  get validationMessage() {
    return this.element.children('.govuk-error-message', { log: false })
  }

  shouldHaveValidationMessage(message: string): void {
    this.validationMessage.should('contain', message)
  }

  shouldNotHaveValidationMessage(): void {
    this.validationMessage.should('not.exist')
  }
}
