import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import FormInputComponent from '../../../../pages/components/formInputComponent'

export default class ResponsibleOfficerComponent extends SingleQuestionFormComponent {
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

  fillInWith(value: string) {
    // TODO implement fillInWith method
    throw new Error(`Method not implemented.${value}`)
  }
}
