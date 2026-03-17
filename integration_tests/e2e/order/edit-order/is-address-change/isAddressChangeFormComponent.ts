import FormComponent from '../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'
import { PageElement } from '../../../../pages/page'

export default class IsAddressChangeFormComponent extends FormComponent {
  get isAddressChangeField(): FormRadiosComponent {
    const label = "Are you amending this form because the device wearer's primary address has changed?"
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  get backButton(): PageElement {
    return this.form.contains('Cancel and return back to form')
  }

  fillInWith(isAddressChange: string): void {
    if (isAddressChange) {
      this.isAddressChangeField.set(isAddressChange)
    }
  }
}
