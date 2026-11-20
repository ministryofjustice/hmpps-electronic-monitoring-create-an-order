import FormComponent from '../../formComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export const RESPONSIBLE_ADULT_QUESTION = 'Is a responsible adult required?'

export default class AdultAtInstallationFormComponent extends FormComponent {
  get responsibleAdultRequiredField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, RESPONSIBLE_ADULT_QUESTION, ['Yes', 'No'], true)
  }

  fillInWith(responsibleAdultRequired: 'Yes' | 'No') {
    this.responsibleAdultRequiredField.set(responsibleAdultRequired)
  }
}
