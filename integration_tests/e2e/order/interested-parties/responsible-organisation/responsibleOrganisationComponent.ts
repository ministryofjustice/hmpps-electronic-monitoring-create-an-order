import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'

export default class ResponsbileOrganisationComponent extends SingleQuestionFormComponent {
  get branchField(): FormRadiosComponent {
    const label = 'WIP Responsible Organisation'
    return new FormRadiosComponent(this.form, label, [])
  }

  fillInWith(value: string) {
    if (value) {
      this.branchField.set(value)
    }
  }
}
