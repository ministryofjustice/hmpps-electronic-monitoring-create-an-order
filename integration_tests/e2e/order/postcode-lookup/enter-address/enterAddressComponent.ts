import FormComponent from '../../../../pages/components/formComponent'
import FormInputComponent from '../../../../pages/components/formInputComponent'

export type AddressFormData = {
  addressLine1?: string
  addressLine2?: string
  addressLine3?: string
  addressLine4?: string
  postcode?: string
}

export default class EnterAddressComponent extends FormComponent {
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
  }
}
