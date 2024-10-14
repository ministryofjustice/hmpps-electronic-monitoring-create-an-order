import { PageElement } from '../page'

export default class FormInputComponent {
  private element: PageElement

  constructor(fieldset: PageElement, label: string) {
    this.element = fieldset.getByLabel(label)
    this.element.should('exist')
  }

  get validationMessage() {
    return this.element.siblings('.govuk-error-message')
  }

  set(value?: string | number | boolean) {
    this.element.type(value as string)
  }

  shouldHaveValue(value?: string | number | boolean) {
    this.element.should('have.value', value as string)
  }

  shouldHaveValidationMessage(message: string) {
    this.validationMessage.should('contain', message)
  }

  shouldBeDisabled() {
    this.element.should('be.disabled')
  }
}
