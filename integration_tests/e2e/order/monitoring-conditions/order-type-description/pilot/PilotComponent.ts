import SingleQuestionFormComponent from '../../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'
import { PageElement } from '../../../../../pages/page'

export default class PilotComponent extends SingleQuestionFormComponent {
  get pilotField(): FormRadiosComponent {
    const label = 'What pilot project is the device wearer part of?'
    return new FormRadiosComponent(this.form, label, [])
  }

  get backButton(): PageElement {
    return this.form.contains('Cancel and return back to form')
  }

  fillInWith(value: string) {
    if (value) {
      this.pilotField.set(value)
    }
  }
}
