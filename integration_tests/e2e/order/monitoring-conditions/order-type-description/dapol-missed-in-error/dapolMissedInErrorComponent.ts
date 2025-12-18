import SingleQuestionFormComponent from '../../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'

export default class DapolMissedInErrorComponent extends SingleQuestionFormComponent {
  get dapolMissedInErrorField(): FormRadiosComponent {
    const label = 'Are you submitting this form becasue DAPOL was missed in error at point of release?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  fillInWith(value: string) {
    if (value) {
      this.dapolMissedInErrorField.set(value)
    }
  }
}
