import { PageElement } from '../../../../../pages/page'
import SingleQuestionFormComponent from '../../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'

export default class OrderTypeComponent extends SingleQuestionFormComponent {
  get monitoringTypesField(): FormRadiosComponent {
    const label = 'What monitoring does the device wearer need?'
    return new FormRadiosComponent(this.form, label, [])
  }

  get ReturnToMonitoringListPageButton(): PageElement {
    return this.form.contains('Return to monitoring you have added')
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
