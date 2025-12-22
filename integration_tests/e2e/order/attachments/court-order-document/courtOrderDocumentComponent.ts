import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'

export default class CourtOrderDocumentFormComponent extends SingleQuestionFormComponent {
  get havePhotoField(): FormRadiosComponent {
    const label = 'Do you have a photo to upload?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  fillInWith(value: string) {
    this.havePhotoField.set(value)
  }
}
