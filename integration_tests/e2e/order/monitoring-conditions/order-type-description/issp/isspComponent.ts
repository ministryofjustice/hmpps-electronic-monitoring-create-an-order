import SingleQuestionFormComponent from '../../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'
import { PageElement } from '../../../../../pages/page'

export default class HdcComponent extends SingleQuestionFormComponent {
  get isspField(): FormRadiosComponent {
    const label = 'Is the device wearer on the Intensive Supervision and Surveillance Programme (ISSP)?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  get backButton(): PageElement {
    return this.form.contains('Cancel and return back to form')
  }

  fillInWith(value: string) {
    if (value) {
      this.isspField.set(value)
    }
  }
}
