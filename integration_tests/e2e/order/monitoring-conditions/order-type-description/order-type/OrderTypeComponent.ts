import SingleQuestionFormComponent from '../../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'
import { PageElement } from '../../../../../pages/page'

export default class OrderTypeComponent extends SingleQuestionFormComponent {
  get orderTypeField(): FormRadiosComponent {
    const label = 'What is the order type?'
    return new FormRadiosComponent(this.form, label, [])
  }

  get backButton(): PageElement {
    return this.form.contains('Cancel and return back to form')
  }

  fillInWith(value: string) {
    if (value) {
      this.orderTypeField.set(value)
    }
  }
}
