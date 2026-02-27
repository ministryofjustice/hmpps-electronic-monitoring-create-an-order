import FormComponent from '../../formComponent'
import FormInputComponent from '../../formInputComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type ContactDetailsFormData = {
  contactNumber?: string
}

export default class ContactDetailsFormComponent extends FormComponent {
  // FIELDS

  get contactNumberAvailableField(): FormRadiosComponent {
    const label = 'Does the device wearer have a contact telephone number?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  get contactNumberField(): FormInputComponent {
    const label = "What is the device wearer's telephone number?"
    return new FormInputComponent(this.form, label)
  }

  // FORM HELPERS

  fillInWith(profile: ContactDetailsFormData): void {
    if (profile.contactNumber && profile.contactNumber.length > 0) {
      this.contactNumberAvailableField.set('Yes')
      this.contactNumberField.set(profile.contactNumber)
    } else {
      this.contactNumberAvailableField.set('No')
    }
  }

  shouldBeValid(): void {
    this.contactNumberField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.contactNumberField.shouldBeDisabled()
  }
}
