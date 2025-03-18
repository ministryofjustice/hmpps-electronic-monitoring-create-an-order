import FormComponent from '../../formComponent'
import FormInputComponent from '../../formInputComponent'

export type ContactDetailsFormData = {
  contactNumber?: string
}

export default class ContactDetailsFormComponent extends FormComponent {
  // FIELDS

  get contactNumberField(): FormInputComponent {
    const label = "What is the device wearer's telephone number?"
    return new FormInputComponent(this.form, label)
  }

  // FORM HELPERS

  fillInWith(profile: ContactDetailsFormData): void {
    if (profile.contactNumber) {
      this.contactNumberField.set(profile.contactNumber)
    }
  }

  shouldBeValid(): void {
    this.contactNumberField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.contactNumberField.shouldBeDisabled()
  }
}
