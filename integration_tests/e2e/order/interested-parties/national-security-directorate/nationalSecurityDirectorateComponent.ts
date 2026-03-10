import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'

export default class NationalSecurityDirectorateComponent extends SingleQuestionFormComponent {
  get ndsField(): FormRadiosComponent {
    const label = 'Is the device wearer being managed by the Nation Security Directorate (NSD)?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  fillInWith(value: string) {
    if (value) {
      this.ndsField.set(value)
    }
  }
}
