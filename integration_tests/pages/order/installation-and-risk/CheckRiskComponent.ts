import SingleQuestionFormComponent from '../../components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../components/formRadiosComponent'

export const CHECK_RISK_QUESTION = `Check if the device wearer's risk has changed`

export default class CheckRiskComponent extends SingleQuestionFormComponent {
  get checkRiskField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, CHECK_RISK_QUESTION, ['Yes', 'No'], true)
  }

  fillInWith(value: 'Yes' | 'No') {
    this.checkRiskField.set(value)
  }
}
