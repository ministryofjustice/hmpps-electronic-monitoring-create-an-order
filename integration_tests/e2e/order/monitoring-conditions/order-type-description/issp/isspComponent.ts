import FormComponent from '../../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'
import { PageElement } from '../../../../../pages/page'

export default class HdcComponent extends FormComponent {
  get isspField(): FormRadiosComponent {
    const label = 'Is the device wearer on the Intensive Supervision and Surveillance Programme (ISSP)?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  get backButton(): PageElement {
    return this.form.contains('Cancel and return back to form')
  }

  fillInWith(issp: string) {
    if (issp) {
      this.isspField.set(issp)
    }
  }
}
