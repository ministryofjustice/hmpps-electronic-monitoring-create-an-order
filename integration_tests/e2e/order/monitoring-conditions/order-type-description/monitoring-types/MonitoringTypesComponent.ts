import FormCheckboxesComponent from '../../../../../pages/components/formCheckboxesComponent'
import { PageElement } from '../../../../../pages/page'
import SingleQuestionFormComponent from '../../../../../pages/components/SingleQuestionFormComponent'

export default class OrderTypeComponent extends SingleQuestionFormComponent {
  get monitoringTypesField(): FormCheckboxesComponent {
    const label = 'What monitoring does the device wearer need?'
    return new FormCheckboxesComponent(this.form, label, [])
  }

  get message(): PageElement {
    return cy.get('.govuk-inset-text')
  }

  fillInWith(value: string) {
    if (value) {
      this.monitoringTypesField.set(value)
    }
  }
}
