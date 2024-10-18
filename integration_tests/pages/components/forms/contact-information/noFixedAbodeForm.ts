import FormComponent from '../../formComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type NoFixedAbodeFormData = {
  noFixedAbode?: string
}

export default class NoFixedAbodeFormComponent extends FormComponent {
  // FIELDS

  get noFixedAbodeField(): FormRadiosComponent {
    const label = 'Does the device wearer have a fixed address?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  // FORM HELPERS

  fillInWith(profile: NoFixedAbodeFormData): void {
    if (profile.noFixedAbode) {
      this.noFixedAbodeField.set(profile.noFixedAbode)
    }
  }

  shouldBeValid(): void {
    this.noFixedAbodeField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.noFixedAbodeField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.noFixedAbodeField.shouldNotBeDisabled()
  }
}
