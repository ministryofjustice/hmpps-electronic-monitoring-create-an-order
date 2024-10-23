import FormComponent from '../../formComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type NoFixedAbodeFormData = {
  hasFixedAddress?: string
}

export default class NoFixedAbodeFormComponent extends FormComponent {
  // FIELDS

  get hasFixedAddressField(): FormRadiosComponent {
    const label = 'Does the device wearer have a fixed address?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  // FORM HELPERS

  fillInWith(profile: NoFixedAbodeFormData): void {
    if (profile.hasFixedAddress) {
      this.hasFixedAddressField.set(profile.hasFixedAddress)
    }
  }

  shouldBeValid(): void {
    this.hasFixedAddressField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.hasFixedAddressField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.hasFixedAddressField.shouldNotBeDisabled()
  }
}
