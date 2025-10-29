import FormComponent from '../../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'

export default class PoliceAreaComponent extends FormComponent {
  get policeAreaField(): FormRadiosComponent {
    const label = "Which police force area is the device wearer's release address in?"
    return new FormRadiosComponent(this.form, label, [])
  }

  fillInWith(policeArea: string) {
    if (policeArea) {
      this.policeAreaField.set(policeArea)
    }
  }
}
