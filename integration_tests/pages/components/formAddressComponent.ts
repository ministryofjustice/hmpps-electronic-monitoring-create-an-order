import { v4 as uuidv4 } from 'uuid'

import { PageElement } from '../page'
import FormInputComponent from './formInputComponent'

export type FormAddressData = {
  line1?: string
  line2?: string
  line3?: string
  line4?: string
  postcode?: string
}

export default class FormAddressComponent {
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

  get line1Field(): FormInputComponent {
    const label = 'Address line 1'
    return new FormInputComponent(this.element, label)
  }

  get line2Field(): FormInputComponent {
    const label = 'Address line 2'
    return new FormInputComponent(this.element, label)
  }

  get cityField(): FormInputComponent {
    const label = 'Town or city'
    return new FormInputComponent(this.element, label)
  }

  get countyField(): FormInputComponent {
    const label = 'County'
    return new FormInputComponent(this.element, label)
  }

  get postcodeField(): FormInputComponent {
    const label = 'Postcode'
    return new FormInputComponent(this.element, label)
  }

  set(address?: FormAddressData) {
    if (address.line1) {
      this.line1Field.set(address.line1)
    }

    if (address.line2) {
      this.line2Field.set(address.line2)
    }

    if (address.line3) {
      this.cityField.set(address.line3)
    }

    if (address.line4) {
      this.countyField.set(address.line4)
    }

    if (address.postcode) {
      this.postcodeField.set(address.postcode)
    }
  }

  shouldHaveValue(address?: FormAddressData) {
    this.line1Field.shouldHaveValue(address.line1 || '')
    this.line2Field.shouldHaveValue(address.line2 || '')
    this.cityField.shouldHaveValue(address.line3 || '')
    this.countyField.shouldHaveValue(address.line4 || '')
    this.postcodeField.shouldHaveValue(address.postcode || '')
  }

  shouldBeDisabled() {
    this.line1Field.shouldBeDisabled()
    this.line2Field.shouldBeDisabled()
    this.cityField.shouldBeDisabled()
    this.countyField.shouldBeDisabled()
    this.postcodeField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.line1Field.shouldNotBeDisabled()
    this.line2Field.shouldNotBeDisabled()
    this.cityField.shouldNotBeDisabled()
    this.countyField.shouldNotBeDisabled()
    this.postcodeField.shouldNotBeDisabled()
  }

  shouldNotHaveValidationMessage(): void {
    this.line1Field.shouldNotHaveValidationMessage()
    this.line2Field.shouldNotHaveValidationMessage()
    this.cityField.shouldNotHaveValidationMessage()
    this.countyField.shouldNotHaveValidationMessage()
    this.postcodeField.shouldNotHaveValidationMessage()
  }
}
