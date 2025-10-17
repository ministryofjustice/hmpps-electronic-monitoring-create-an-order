import { v4 as uuidv4 } from 'uuid'

import { PageElement } from '../page'
import FormInputComponent from './formInputComponent'

export type FormAddressData = {
  addressLine1?: string
  addressLine2?: string
  addressLine3?: string
  addressLine4?: string
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

  get addressLine1Field(): FormInputComponent {
    const label = 'Address line 1'
    return new FormInputComponent(this.element, label)
  }

  get addressLine2Field(): FormInputComponent {
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
    if (address.addressLine1) {
      this.addressLine1Field.set(address.addressLine1)
    }

    if (address.addressLine2) {
      this.addressLine2Field.set(address.addressLine2)
    }

    if (address.addressLine3) {
      this.cityField.set(address.addressLine3)
    }

    if (address.addressLine4) {
      this.countyField.set(address.addressLine4)
    }

    if (address.postcode) {
      this.postcodeField.set(address.postcode)
    }
  }

  shouldHaveValue(address?: FormAddressData) {
    this.addressLine1Field.shouldHaveValue(address.addressLine1 || '')
    this.addressLine2Field.shouldHaveValue(address.addressLine2 || '')
    this.cityField.shouldHaveValue(address.addressLine3 || '')
    this.countyField.shouldHaveValue(address.addressLine4 || '')
    this.postcodeField.shouldHaveValue(address.postcode || '')
  }

  shouldBeDisabled() {
    this.addressLine1Field.shouldBeDisabled()
    this.addressLine2Field.shouldBeDisabled()
    this.cityField.shouldBeDisabled()
    this.countyField.shouldBeDisabled()
    this.postcodeField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.addressLine1Field.shouldNotBeDisabled()
    this.addressLine2Field.shouldNotBeDisabled()
    this.cityField.shouldNotBeDisabled()
    this.countyField.shouldNotBeDisabled()
    this.postcodeField.shouldNotBeDisabled()
  }

  shouldNotHaveValidationMessage(): void {
    this.addressLine1Field.shouldNotHaveValidationMessage()
    this.addressLine2Field.shouldNotHaveValidationMessage()
    this.cityField.shouldNotHaveValidationMessage()
    this.countyField.shouldNotHaveValidationMessage()
    this.postcodeField.shouldNotHaveValidationMessage()
  }
}
