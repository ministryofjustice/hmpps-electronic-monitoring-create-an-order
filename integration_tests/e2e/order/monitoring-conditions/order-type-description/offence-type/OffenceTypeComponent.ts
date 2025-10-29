import FormComponent from '../../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'

export default class OffenceTypeComponent extends FormComponent {
  get offenceTypeField(): FormRadiosComponent {
    const label = 'What type of acquisitive crime offence did the device wearer commit?'
    return new FormRadiosComponent(this.form, label, [])
  }

  fillInWith(offenceType: string) {
    if (offenceType) {
      this.offenceTypeField.set(offenceType)
    }
  }
}
