import SingleQuestionFormComponent from '../../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'
import { PageElement } from '../../../../../pages/page'

export default class PrarrComponent extends SingleQuestionFormComponent {
  get prarrField(): FormRadiosComponent {
    const label = 'Has the device wearer been released on a Presumptive Risk Assessed Release Review (P-RARR)?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  get backButton(): PageElement {
    return this.form.contains('Cancel and return back to form')
  }

  fillInWith(value: string) {
    if (value) {
      this.prarrField.set(value)
    }
  }
}
