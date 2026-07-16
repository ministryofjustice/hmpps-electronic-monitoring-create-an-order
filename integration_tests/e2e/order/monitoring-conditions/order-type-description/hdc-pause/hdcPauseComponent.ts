import SingleQuestionFormComponent from '../../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'

export default class HdcPauseComponent extends SingleQuestionFormComponent {
  get hdcPauseField(): FormRadiosComponent {
    const label = 'Are you sure the device wearer is on a Home Detention Curfew(HDC)?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  fillInWith(value: string) {
    if (value) {
      this.hdcPauseField.set(value)
    }
  }
}
