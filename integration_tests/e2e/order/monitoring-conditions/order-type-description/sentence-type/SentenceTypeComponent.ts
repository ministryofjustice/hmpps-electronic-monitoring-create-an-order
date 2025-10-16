import FormComponent from '../../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'

export default class SentenceTypeComponent extends FormComponent {
  get sentenceTypeField(): FormRadiosComponent {
    const label = 'What type of sentence has the device wearer been given?'
    return new FormRadiosComponent(this.form, label, [])
  }

  get bailTypeField(): FormRadiosComponent {
    const label = 'What type of bail has the device wearer been given?'
    return new FormRadiosComponent(this.form, label, [])
  }

  fillInWith(sentenceType: string) {
    if (sentenceType) {
      this.sentenceTypeField.set(sentenceType)
    }
  }
}
