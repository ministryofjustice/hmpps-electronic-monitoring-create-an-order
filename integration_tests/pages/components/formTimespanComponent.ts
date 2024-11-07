import { v4 as uuidv4 } from 'uuid'

import { PageElement } from '../page'
import { deserialiseTime } from '../../../server/utils/utils'

export default class FormTimespanComponent {
  private elementCacheId: string = uuidv4()

  constructor(
    private readonly parent: PageElement,
    private readonly label: string,
  ) {
    this.parent.getByLegend(this.label, { log: false }).as(`${this.elementCacheId}-element`)
    this.element.should('exist')

    this.element.getByLabel('Start Hour', { log: false }).as(`${this.elementCacheId}-start-hour`)
    this.element.getByLabel('Start Minutes', { log: false }).as(`${this.elementCacheId}-start-minutes`)
    this.element.getByLabel('End Hour', { log: false }).as(`${this.elementCacheId}-end-hour`)
    this.element.getByLabel('End Minutes', { log: false }).as(`${this.elementCacheId}-end-minutes`)
  }

  get element(): PageElement {
    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  get startHour(): PageElement {
    return cy.get(`@${this.elementCacheId}-start-hour`, { log: false })
  }

  setStartHour(value: string) {
    this.startHour.type(value)
  }

  get startMinutes(): PageElement {
    return cy.get(`@${this.elementCacheId}-start-minutes`, { log: false })
  }

  setStartMinutes(value: string) {
    this.startMinutes.type(value)
  }

  get endHour(): PageElement {
    return cy.get(`@${this.elementCacheId}-end-hour`, { log: false })
  }

  setEndHour(value: string) {
    this.endHour.type(value)
  }

  get endMinutes(): PageElement {
    return cy.get(`@${this.elementCacheId}-end-minutes`, { log: false })
  }

  setEndMinutes(value: string) {
    this.endMinutes.type(value)
  }

  set(startTime: string, endTime: string) {
    const [startHour, startMinutes] = deserialiseTime(startTime)
    this.setStartHour(startHour)
    this.setStartMinutes(startMinutes)
    const [endHour, endMinutes] = deserialiseTime(endTime)
    this.setEndHour(endHour)
    this.setEndMinutes(endMinutes)
  }

  shouldHaveValue(startTime: string, endTime: string) {
    const [startHour, startMinutes] = deserialiseTime(startTime)
    const [endHour, endMinutes] = deserialiseTime(endTime)

    this.startHour.should('have.value', startHour)
    this.startMinutes.should('have.value', startMinutes)
    this.endHour.should('have.value', endHour)
    this.endMinutes.should('have.value', endMinutes)
  }

  shouldBeDisabled(): void {
    this.startHour.should('be.disabled')
    this.startMinutes.should('be.disabled')
    this.endHour.should('be.disabled')
    this.endMinutes.should('be.disabled')
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
