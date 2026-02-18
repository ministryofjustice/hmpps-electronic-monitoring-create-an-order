import SingleQuestionFormComponent from '../../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'

export default class SentenceTypeComponent extends SingleQuestionFormComponent {
  get sentenceTypeField(): FormRadiosComponent {
    const label = 'What type of sentence has the device wearer been given?'
    return new FormRadiosComponent(this.form, label, [])
  }

  get bailTypeField(): FormRadiosComponent {
    const label = 'What type of bail has the device wearer been given?'
    return new FormRadiosComponent(this.form, label, [])
  }

  fillInWith(value: string) {
    if (value) {
      this.sentenceTypeField.set(value)
    }
  }
}
