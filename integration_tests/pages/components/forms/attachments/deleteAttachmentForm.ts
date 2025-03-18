import { PageElement } from '../../../page'
import FormComponent from '../../formComponent'

export default class DeleteAttachmentFormComponent extends FormComponent {
  // FIELDS

  // FORM HELPERS

  get backButton(): PageElement {
    return this.form.contains('button', 'Cancel and return to check answers')
  }

  get deleteButton(): PageElement {
    return this.form.contains('button', 'Yes, delete')
  }
}
