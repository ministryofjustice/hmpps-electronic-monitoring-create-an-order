import FormComponent from '../../formComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export default class NewDocumentFormComponent extends FormComponent {
  get needNewDocumentField(): FormRadiosComponent {
    const label = 'Do you need to upload a new document?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }
}
