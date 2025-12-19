import SingleQuestionFormComponent from '../../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'

export default class OffenceListComponent extends SingleQuestionFormComponent {
  get branchField(): FormRadiosComponent {
    const label = 'WIP Offence List'
    return new FormRadiosComponent(this.form, label, ['Add', 'Continue', 'Delete'])
  }

  fillInWith(value: string) {
    if (value) {
      this.branchField.set(value)
    }
  }
}
