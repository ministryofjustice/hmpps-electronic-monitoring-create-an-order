import { PageElement } from '../../../page'
import FormComponent from '../../formComponent'

export default class ConfirmVariationFormComponent extends FormComponent {
  get backButton(): PageElement {
    return this.form.contains('button', 'Cancel and return back to form')
  }

  get confirmButton(): PageElement {
    return this.form.contains('button', 'Yes, make changes')
  }
}
