import FormComponent from '../../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'
import { PageElement } from '../../../../../pages/page'

export default class HdcComponent extends FormComponent {
  get hdcField(): FormRadiosComponent {
    const label = 'Is the device wearer on  a Home Detention Curfew(HDC)?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  get backButton(): PageElement {
    return this.form.contains('Cancel and return back to form')
  }

  fillInWith(hdc: string) {
    if (hdc) {
      this.hdcField.set(hdc)
    }
  }
}
