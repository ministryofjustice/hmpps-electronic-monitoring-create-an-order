import FormComponent from '../../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'
import { PageElement } from '../../../../../pages/page'

export default class OrderTypeComponent extends FormComponent {
  get orderTypeField(): FormRadiosComponent {
    const label = 'What is the order type?'
    return new FormRadiosComponent(this.form, label, [])
  }

  get backButton(): PageElement {
    return this.form.contains('Cancel and return back to form')
  }

  fillInWith(orderType: string) {
    if (orderType) {
      this.orderTypeField.set(orderType)
    }
  }
}
