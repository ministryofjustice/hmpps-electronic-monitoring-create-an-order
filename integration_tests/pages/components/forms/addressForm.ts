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
    const label = 'Addresss line 1'
    return new FormInputComponent(this.form, label)
  }

  get addressLine2Field(): FormInputComponent {
    const label = 'Addresss line 2'
    return new FormInputComponent(this.form, label)
  }

  get addressLine3Field(): FormInputComponent {
    const label = 'Addresss line 3'
    return new FormInputComponent(this.form, label)
  }

  get addressLine4Field(): FormInputComponent {
    const label = 'Addresss line 4'
    return new FormInputComponent(this.form, label)
  }

  get postcodeField(): FormInputComponent {
    const label = 'Postcode'
    return new FormInputComponent(this.form, label)
  }

  get hasAnotherAddressField(): FormRadiosComponent {
    const label = 'Does the device wearer have another address they will be monitored at?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  // FORM HELPERS

  fillInWith(profile: AddressFormData): void {
    if (profile.addressLine1) {
      this.addressLine1Field.set(profile.addressLine1)
    }

    if (profile.addressLine2) {
      this.addressLine2Field.set(profile.addressLine2)
    }

    if (profile.addressLine3) {
      this.addressLine3Field.set(profile.addressLine3)
    }

    if (profile.addressLine4) {
      this.addressLine4Field.set(profile.addressLine4)
    }

    if (profile.postcode) {
      this.postcodeField.set(profile.postcode)
    }

    if (profile.hasAnotherAddress) {
      this.hasAnotherAddressField.set(profile.hasAnotherAddress)
    }
  }

  shouldBeValid(): void {
    this.addressLine1Field.shouldNotHaveValidationMessage()
    this.addressLine2Field.shouldNotHaveValidationMessage()
    this.postcodeField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.addressLine1Field.shouldBeDisabled()
    this.addressLine2Field.shouldBeDisabled()
    this.addressLine2Field.shouldBeDisabled()
    this.addressLine2Field.shouldBeDisabled()
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
