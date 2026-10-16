import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'

export default class RiskAtAddressComponent extends SingleQuestionFormComponent {
  get riskCategoryField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'WIP Risk at address', [])
  }

  fillInWith(value: string) {
    if (value) {
      this.riskCategoryField.set(value)
    }
  }
}
