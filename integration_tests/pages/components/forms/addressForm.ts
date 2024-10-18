import FormComponent from '../formComponent'
import FormInputComponent from '../formInputComponent'

export type AddressFormData = {
  addressLine1?: string
  addressLine2?: string
  addressLine3?: string
  addressLine4?: string
  postcode?: string
}

export default class AddressFormComponent extends FormComponent {
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
  }
}
