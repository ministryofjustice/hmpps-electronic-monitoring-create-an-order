import FormComponent from '../formComponent'
import FormInputComponent from '../formInputComponent'
import FormRadiosComponent from '../formRadiosComponent'

export type AddressFormData = {
  line1?: string
  line2?: string
  line3?: string
  line4?: string
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

  fillInWith(address: AddressFormData): void {
    if (address.line1) {
      this.addressLine1Field.set(address.line1)
    }

    if (address.line2) {
      this.addressLine2Field.set(address.line2)
    }

    if (address.line3) {
      this.addressLine3Field.set(address.line3)
    }

    if (address.line4) {
      this.addressLine4Field.set(address.line4)
    }

    if (address.postcode) {
      this.postcodeField.set(address.postcode)
    }

    if (address.hasAnotherAddress) {
      this.hasAnotherAddressField.set(address.hasAnotherAddress)
    }
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
}
