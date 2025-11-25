import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'

export default class FindAddressComponenet extends SingleQuestionFormComponent {
  get branchField(): FormRadiosComponent {
    const label = 'WIP Find Address'
    return new FormRadiosComponent(this.form, label, [])
  }

  fillInWith(value: string) {
    if (value) {
      this.branchField.set(value)
    }
  }
}
