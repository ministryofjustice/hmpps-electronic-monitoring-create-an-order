import FormComponent from '../../../../pages/components/formComponent'
import FormInputComponent from '../../../../pages/components/formInputComponent'

type ResponsibleOfficerPageInput = {
  firstName?: string

  lastName?: string

  email?: string
}
export default class ResponsibleOfficerComponent extends FormComponent {
  get firstNameField(): FormInputComponent {
    const label = "What is the Responsible Officer's first name?"
    return new FormInputComponent(this.form, label)
  }

  get lastNameField(): FormInputComponent {
    const label = "What is the Responsible Officer's last name?"
    return new FormInputComponent(this.form, label)
  }

  get emailField(): FormInputComponent {
    const label = "What is the Responsible Officer's email address?"
    return new FormInputComponent(this.form, label)
  }

  fillInWith(input: ResponsibleOfficerPageInput) {
    if (input.firstName) {
      this.firstNameField.set(input.firstName)
    }

    if (input.lastName) {
      this.lastNameField.set(input.lastName)
    }

    if (input.email) {
      this.emailField.set(input.email)
    }
  }
}
