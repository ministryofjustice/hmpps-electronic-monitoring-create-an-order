import { PageElement } from '../page'

export default class FormRadiosComponent {
  constructor(
    _parent: PageElement,
    private readonly label: string,
    private readonly options: (string | RegExp)[],
    _getByLegend: boolean = false,
  ) {}

  get element(): PageElement {
    return cy.get('form', { log: false }).then($form => {
      const fieldset = $form
        .find('.govuk-fieldset')
        .toArray()
        .find(element => element.querySelector('legend')?.textContent?.includes(this.label))

      if (!fieldset) {
        throw new Error(`No radio group found with legend ${this.label}`)
      }

      return cy.wrap(fieldset, { log: false })
    })
  }

  private option(value: string | RegExp): PageElement {
    return cy.get('form', { log: false }).then($form => {
      const fieldset = $form
        .find('.govuk-fieldset')
        .toArray()
        .find(element => element.querySelector('legend')?.textContent?.includes(this.label))
      const matchingLabel = Array.from(fieldset?.querySelectorAll('label') ?? []).find(element => {
        const text = element.textContent?.trim() ?? ''

        return value instanceof RegExp ? new RegExp(value.source, value.flags).test(text) : text.includes(value)
      })
      const inputId = matchingLabel?.getAttribute('for')

      if (!inputId) {
        throw new Error(`No input associated with label ${value.toString()} in radio group ${this.label}`)
      }

      return cy.get(`#${CSS.escape(inputId)}`, { log: false })
    })
  }

  set(value: string | RegExp) {
    this.option(value).should('exist').and('not.be.disabled')
    this.option(value).check()
  }

  shouldHaveValue(value: string): void {
    this.option(value).should('be.checked')
  }

  shouldNotHaveValue(): void {
    this.options.forEach(option => this.option(option).should('not.be.checked'))
  }

  shouldHaveDivider(value: string | RegExp): void {
    this.element.find('.govuk-radios__divider').should('exist').should('contain', value)
  }

  shouldNotHaveDivider(): void {
    this.element.find('.govuk-radios__divider').should('not.exist')
  }

  shouldHaveOption(value: string | RegExp): void {
    this.option(value).should('exist')
  }

  shouldHaveEnabledOption(value: string | RegExp): void {
    this.option(value).should('exist').should('not.be.disabled')
  }

  shouldHaveDescription(label: string | RegExp, description: string | RegExp): void {
    this.option(label).siblings('.govuk-radios__hint').should('contain.text', description)
  }

  shouldNotHaveOption(value: string | RegExp): void {
    this.element.get('label').should('not.contain', value)
  }

  shouldHaveDisabledOption(value: string | RegExp): void {
    this.option(value).should('be.disabled')
  }

  shouldExist(): void {
    this.element.should('exist')
  }

  shouldNotExist(): void {
    this.element.should('not.exist')
  }

  shouldBeDisabled(): void {
    this.element.find('input[type=radio]').each(input => cy.wrap(input).should('be.disabled'))
  }

  shouldNotBeDisabled(): void {
    this.element.find('input[type=radio]').each(input => cy.wrap(input).should('not.be.disabled'))
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

  shouldHaveAllOptions(): void {
    this.options.forEach(option => this.shouldHaveOption(option))
  }

  shouldHaveHint(message: string): void {
    this.element.find('.govuk-hint').contains(message).should('exist')
  }
}
