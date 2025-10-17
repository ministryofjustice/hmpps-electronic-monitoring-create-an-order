import FormComponent from '../../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'
import { PageElement } from '../../../../../pages/page'

export default class PilotComponent extends FormComponent {
  get pilotField(): FormRadiosComponent {
    const label = 'What pilot project is the device wearer part of?'
    return new FormRadiosComponent(this.form, label, [])
  }

  get backButton(): PageElement {
    return this.form.contains('Cancel and return back to form')
  }

  fillInWith(pilot: string) {
    if (pilot) {
      this.pilotField.set(pilot)
    }
  }
}
