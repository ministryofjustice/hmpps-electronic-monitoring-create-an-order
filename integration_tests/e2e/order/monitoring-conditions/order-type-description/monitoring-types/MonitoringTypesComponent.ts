import FormComponent from '../../../../../pages/components/formComponent'
import FormCheckboxesComponent from '../../../../../pages/components/formCheckboxesComponent'
import { PageElement } from '../../../../../pages/page'

export default class OrderTypeComponent extends FormComponent {
  get monitoringTypesField(): FormCheckboxesComponent {
    const label = 'What monitoring does the device wearer need?'
    return new FormCheckboxesComponent(this.form, label, [])
  }

  get message(): PageElement {
    return cy.get('.govuk-inset-text')
  }

  fillInWith(monitoringType: string) {
    if (monitoringType) {
      this.monitoringTypesField.set(monitoringType)
    }
  }
}
