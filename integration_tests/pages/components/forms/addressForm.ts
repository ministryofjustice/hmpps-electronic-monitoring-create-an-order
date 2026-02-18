import FormComponent from '../formComponent'
import FormInputComponent from '../formInputComponent'
import FormRadiosComponent from '../formRadiosComponent'

export type AddressFormData = {
  addressLine1?: string
  addressLine2?: string
  addressLine3?: string
  addressLine4?: string
  postcode?: string
  hasAnotherAddress?: string
}

export default class AddressFormComponent extends FormComponent {
  constructor(private readonly canCreateAnotherAddress: boolean = true) {
    super()
  }

  // FIELDS

  get addressLine1Field(): FormInputComponent {
    const label = 'Address line 1'
    return new FormInputComponent(this.form, label)
  }

  get addressLine2Field(): FormInputComponent {
    const label = 'Address line 2 (optional)'
    return new FormInputComponent(this.form, label)
  }

  get addressLine3Field(): FormInputComponent {
    const label = 'Town or city'
    return new FormInputComponent(this.form, label)
  }

  get addressLine4Field(): FormInputComponent {
    const label = 'County (optional)'
    return new FormInputComponent(this.form, label)
  }

  get postcodeField(): FormInputComponent {
    const label = 'Postcode'
    return new FormInputComponent(this.form, label)
  }

  get hasAnotherAddressField(): FormRadiosComponent {
    const label = 'Are electronic monitoring devices required at another address?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  // FORM HELPERS

  clearAllFields(): void {
    this.addressLine1Field.clear()
    this.addressLine2Field.clear()
    this.addressLine3Field.clear()
    this.addressLine4Field.clear()
    this.postcodeField.clear()
  }

  fillInWith(address: AddressFormData): void {
    if (address.addressLine1) {
      this.addressLine1Field.set(address.addressLine1)
    }

    if (address.addressLine2) {
      this.addressLine2Field.set(address.addressLine2)
    }

    if (address.addressLine3) {
      this.addressLine3Field.set(address.addressLine3)
    }

    if (address.addressLine4) {
      this.addressLine4Field.set(address.addressLine4)
    }

    if (address.postcode) {
      this.postcodeField.set(address.postcode)
    }

    if (address.hasAnotherAddress) {
      this.hasAnotherAddressField.set(address.hasAnotherAddress)
    }
  }

  clearAndRepopulate(newAddress) {
    this.clearAllFields()
    this.fillInWith(newAddress)
  }

  hasAnotherAddress(hasAnotherAddress: boolean) {
    this.hasAnotherAddressField.set(hasAnotherAddress ? 'Yes' : 'No')
  }

  shouldBeValid(): void {
    this.addressLine1Field.shouldNotHaveValidationMessage()
    this.addressLine2Field.shouldNotHaveValidationMessage()
    this.addressLine3Field.shouldNotHaveValidationMessage()
    this.addressLine4Field.shouldNotHaveValidationMessage()
    this.postcodeField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.addressLine1Field.shouldBeDisabled()
    this.addressLine2Field.shouldBeDisabled()
    this.addressLine3Field.shouldBeDisabled()
    this.addressLine4Field.shouldBeDisabled()
    this.postcodeField.shouldBeDisabled()

    if (this.canCreateAnotherAddress) {
      this.hasAnotherAddressField.shouldBeDisabled()
    }
  }

  shouldNotBeDisabled(): void {
    this.addressLine1Field.shouldNotBeDisabled()
    this.addressLine2Field.shouldNotBeDisabled()
    this.addressLine2Field.shouldNotBeDisabled()
    this.addressLine2Field.shouldNotBeDisabled()
    this.postcodeField.shouldNotBeDisabled()

    if (this.canCreateAnotherAddress) {
      this.hasAnotherAddressField.shouldNotBeDisabled()
    }
  }

  shouldHaveAllOptions(): void {
    this.hasAnotherAddressField.shouldHaveAllOptions()
  }
}
