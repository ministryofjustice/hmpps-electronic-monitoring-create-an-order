import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'

export default class HaveGrantOfBailFormComponent extends SingleQuestionFormComponent {
  get haveCourtOrderField(): FormRadiosComponent {
    const label = 'Do you have a Grant of Bail to upload?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  fillInWith(value: string) {
    this.haveCourtOrderField.set(value)
  }
}
