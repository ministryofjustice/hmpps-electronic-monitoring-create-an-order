import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import FormCheckboxesComponent from '../../../../pages/components/formCheckboxesComponent'

export const RISK_AT_ADDRESS_QUESTION = 'At installation what are the possible risks at the address?'

export const RISK_AT_ADDRESS_HINT =
  'Answer questions based on what you know now. Risk can be updated when more is known about the address and who lives there.'

export const NO_RISK_OPTION = 'No risk at the address'
export const RISK_UNKNOWN_OPTION = 'Not able to provide this information'

export const RISK_AT_ADDRESS_OPTIONS = [
  'History of substance abuse',
  'Managed through IOM',
  'Safeguarding adult',
  'Safeguarding child',
  'Safeguarding domestic abuse',
  'Another person or people living at the property who are threatening or violent',
  'Children under the age of 18 are living at the property',
  'Animals at the property, for example dogs',
  'Other known risks',
  NO_RISK_OPTION,
  RISK_UNKNOWN_OPTION,
]

export default class RiskAtAddressComponent extends SingleQuestionFormComponent {
  get riskCategoryField(): FormCheckboxesComponent {
    return new FormCheckboxesComponent(this.form, RISK_AT_ADDRESS_QUESTION, RISK_AT_ADDRESS_OPTIONS, true)
  }

  fillInWith(value: string | string[]) {
    if (value) {
      this.riskCategoryField.set(value)
    }
  }
}
