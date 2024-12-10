import { v4 as uuidv4 } from 'uuid'
import { PageElement } from '../page'

export default class FormDateTimeComponent {
  private elementCacheId: string = uuidv4()

  constructor(
    private readonly parent: PageElement,
    private readonly formGroupId: string,
  ) {
    this.parent.find(`#${this.formGroupId}-form`, { log: false }).as(`${this.elementCacheId}-element`)
    this.element.should('exist')

    this.element.getByLabel('Day', { log: false }).as(`${this.elementCacheId}-day`)
    this.element.getByLabel('Month', { log: false }).as(`${this.elementCacheId}-month`)
    this.element.getByLabel('Year', { log: false }).as(`${this.elementCacheId}-year`)
    this.element.getByLabel('Hour', { log: false }).as(`${this.elementCacheId}-hours`)
    this.element.getByLabel('Minute', { log: false }).as(`${this.elementCacheId}-minutes`)
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

  get hours(): PageElement {
    return cy.get(`@${this.elementCacheId}-hours`, { log: false })
  }

  setHours(value: string) {
    this.hours.type(value)
  }

  get minutes(): PageElement {
    return cy.get(`@${this.elementCacheId}-minutes`, { log: false })
  }

  setMinutes(value: string) {
    this.minutes.type(value)
  }

  set(value: Date) {
    this.setDay(`0${value.getDate()}`.slice(-2))
    this.setMonth(`0${value.getMonth() + 1}`.slice(-2))
    this.setYear(`${value.getFullYear()}`)
    this.setHours(`0${value.getHours()}`.slice(-2))
    this.setMinutes(`0${value.getMinutes()}`.slice(-2))
  }

  shouldHaveValue(value: Date): void {
    this.day.should('have.value', `0${value.getDate()}`.slice(-2))
    this.month.should('have.value', `0${value.getMonth() + 1}`.slice(-2))
    this.year.should('have.value', `${value.getFullYear()}`)
    this.hours.should('have.value', `0${value.getHours()}`.slice(-2))
    this.minutes.should('have.value', `0${value.getMinutes()}`.slice(-2))
  }

  shouldBeDisabled(): void {
    this.day.should('be.disabled')
    this.month.should('be.disabled')
    this.year.should('be.disabled')
    this.hours.should('be.disabled')
    this.minutes.should('be.disabled')
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
