import SingleQuestionFormComponent from '../../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'

export default class PoliceAreaComponent extends SingleQuestionFormComponent {
  get policeAreaField(): FormRadiosComponent {
    const label = "Which police force area is the device wearer's release address in?"
    return new FormRadiosComponent(this.form, label, [])
  }

  fillInWith(value: string) {
    if (value) {
      this.policeAreaField.set(value)
    }
  }
}
