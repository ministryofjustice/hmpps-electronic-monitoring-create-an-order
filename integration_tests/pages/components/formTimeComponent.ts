import { v4 as uuidv4 } from 'uuid'

import { PageElement } from '../page'
import FormInputComponent from './formInputComponent'

export type FormTimeData = {
  hours?: string
  minutes?: string
}

export default class FormTimeComponent {
  private elementCacheId: string = uuidv4()

  constructor(
    private readonly parent: PageElement,
    private readonly label: string,
  ) {
    this.parent.getByLegend(this.label, { log: false }).as(`${this.elementCacheId}-element`)
    this.element.should('exist')
  }

  get element(): PageElement {
    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  // FIELDS

  get hourField(): FormInputComponent {
    const label = 'Hour'
    return new FormInputComponent(this.element, label)
  }

  get minuteField(): FormInputComponent {
    const label = 'Minute'
    return new FormInputComponent(this.element, label)
  }

  set(time?: FormTimeData) {
    if (time.hours) {
      this.hourField.set(time.hours)
    }

    if (time.minutes) {
      this.minuteField.set(time.minutes)
    }
  }

  shouldHaveValue(time?: FormTimeData) {
    this.hourField.shouldHaveValue(time.hours || '')
    this.minuteField.shouldHaveValue(time.minutes || '')
  }

  shouldBeDisabled() {
    this.hourField.shouldBeDisabled()
    this.minuteField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.hourField.shouldNotBeDisabled()
    this.minuteField.shouldNotBeDisabled()
  }

  get validationMessage() {
    return this.element.siblings('.govuk-error-message', { log: false })
  }

  shouldHaveValidationMessage(message: string) {
    this.validationMessage.should('contain', message)
  }

  shouldNotHaveValidationMessage(): void {
    this.validationMessage.should('not.exist')
  }
}
