import FormComponent from '../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'
import { PageElement } from '../../../../pages/page'

export default class IsRejectionFormComponent extends FormComponent {
  get isRejectionField(): FormRadiosComponent {
    const label = 'Are you making changes to this form because the original was rejected by email?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  get backButton(): PageElement {
    return this.form.contains('Cancel and return back to form')
  }
}
