import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import FormCheckboxesComponent from '../../../../pages/components/formCheckboxesComponent'

export const RISK_BEHAVIOUR_QUESTION = "At installation what are the possible risks from the device wearer's behaviour?"

export const RISK_BEHAVIOUR_OPTIONS = [
  'Offensive towards someone because of their sexual orientation',
  'Offensive towards someone because of their sex or gender',
  'Violent behaviour or threats of violence',
  'Sex offender',
  'Offensive towards someone because of their race, nationality, ethnicity or national origin',
  'There are no risks that the installer should be aware of',
]

export default class RiskBehaviourComponent extends SingleQuestionFormComponent {
  get possibleRiskField(): FormCheckboxesComponent {
    return new FormCheckboxesComponent(this.form, RISK_BEHAVIOUR_QUESTION, RISK_BEHAVIOUR_OPTIONS, true)
  }

  fillInWith(value: string | string[]) {
    if (value) {
      this.possibleRiskField.set(value)
    }
  }
}
