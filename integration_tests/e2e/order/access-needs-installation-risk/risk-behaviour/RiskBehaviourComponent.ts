import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'

export default class RiskBehaviourComponent extends SingleQuestionFormComponent {
  get possibleRiskField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'WIP Risk behaviour', [])
  }

  fillInWith(value: string) {
    if (value) {
      this.possibleRiskField.set(value)
    }
  }
}
