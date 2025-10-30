import SingleQuestionFormComponent from '../../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'

export default class OffenceTypeComponent extends SingleQuestionFormComponent {
  get offenceTypeField(): FormRadiosComponent {
    const label = 'What type of acquisitive crime offence did the device wearer commit?'
    return new FormRadiosComponent(this.form, label, [])
  }

  fillInWith(value: string) {
    if (value) {
      this.offenceTypeField.set(value)
    }
  }
}
