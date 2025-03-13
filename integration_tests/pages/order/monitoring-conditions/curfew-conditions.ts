import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import CurfewConditionsFormComponent from '../../components/forms/monitoring-conditions/curfewConditionsFormComponent'

export default class CurfewConditionsPage extends AppFormPage {
  public form = new CurfewConditionsFormComponent()

  constructor() {
    super('Curfew', paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS, 'Electronic monitoring required')
  }

  fillInForm = (): void => {
    cy.get('#startDate-day').type('27')
    cy.get('#startDate-month').type('3')
    cy.get('#startDate-year').type('2025')
    cy.get('#endDate-day').type('28')
    cy.get('#endDate-month').type('4')
    cy.get('#endDate-year').type('2026')
    cy.get('input[value="SECONDARY"]').check()
    cy.get('input[value="TERTIARY"]').check()
  }
}
