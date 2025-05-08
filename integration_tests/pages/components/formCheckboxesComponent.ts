import { v4 as uuidv4 } from 'uuid'

import { PageElement } from '../page'

export default class FormCheckboxesComponent {
  private elementCacheId: string = uuidv4()

  constructor(
    private readonly parent: PageElement,
    private readonly label: string,
    private readonly options: string[] | RegExp[],
  ) {
    this.parent.getByLegend(this.label, { log: false }).as(`${this.elementCacheId}-element`)

    this.options.forEach(option => this.shouldHaveOption(option))
  }

  get element(): PageElement {
    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  set(values: string | string[] | RegExp[]): void {
    const valuesArr = Array.isArray(values) ? values : [values]
    valuesArr.forEach(value => {
      this.element.getByLabel(value).check()
    })
  }

  shouldHaveValue(value: string | RegExp): void {
    this.element.getByLabel(value).should('be.checked')
  }

  shouldNotHaveValue(): void {
    this.options.forEach(option => this.element.getByLabel(option).should('not.be.checked'))
  }

  shouldHaveOption(value: string | RegExp): void {
    this.element.getByLabel(value).should('exist')
  }

  shouldExist(): void {
    this.element.should('exist')
  }

  shouldNotExist(): void {
    this.element.should('not.exist')
  }

  shouldBeDisabled(): void {
    this.element.find('input[type=checkbox]').each(input => cy.wrap(input).should('be.disabled'))
  }

  shouldNotBeDisabled(): void {
    this.element.find('input[type=checkbox]').each(input => cy.wrap(input).should('not.be.disabled'))
  }

  shouldNotBeDisabledWithException(attribute: string, value: string): void {
    this.element.find(`input[type=checkbox]:not([${attribute}="${value}"])`).then($inputs => {
      cy.wrap($inputs).each($input => {
        cy.wrap($input).should('not.be.disabled')
      })
    })
  }

  get validationMessage() {
    return this.element.find('.govuk-error-message', { log: false })
  }

  shouldHaveValidationMessage(message: string): void {
    this.validationMessage.should('contain', message)
  }

  shouldNotHaveValidationMessage(): void {
    this.validationMessage.should('not.exist')
  }
}
