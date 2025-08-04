import FormComponent from '../../formComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export default class PhotoQuestionFormComponent extends FormComponent {
  get photoQuestionField(): FormRadiosComponent {
    const label = 'Do you have a photo to upload?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }
}
