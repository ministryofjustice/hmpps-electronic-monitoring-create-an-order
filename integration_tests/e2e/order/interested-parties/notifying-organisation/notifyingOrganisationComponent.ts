import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'

export default class NotifyingOrganisationComponent extends SingleQuestionFormComponent {
  get branchField(): FormRadiosComponent {
    const label = 'WIP Notifying Organisation'
    return new FormRadiosComponent(this.form, label, [])
  }

  fillInWith(value: string) {
    if (value) {
      this.branchField.set(value)
    }
  }
}
