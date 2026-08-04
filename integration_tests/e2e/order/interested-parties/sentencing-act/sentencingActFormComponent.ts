import FormComponent from '../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'

export default class SentencingActFormComponent extends FormComponent {
  get isSentencingActChangeField(): FormRadiosComponent {
    const label = 'Is the device wearer being released on or after 1 October 2026?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  fillInWith(isSentencingAct: string): void {
    if (isSentencingAct) {
      this.isSentencingActChangeField.set(isSentencingAct)
    }
  }
}
