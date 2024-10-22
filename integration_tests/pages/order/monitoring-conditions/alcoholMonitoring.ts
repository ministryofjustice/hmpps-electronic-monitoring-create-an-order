import AppPage from '../../appPage'
import { PageElement } from '../../page'

export default class AlcoholMonitoringPage extends AppPage {
  constructor() {
    super('Monitoring conditions')
  }

  form = (): PageElement => cy.get('form')

  subHeader = (): PageElement => cy.get('h2')

  saveAndContinueButton = (): PageElement => cy.get('form button[type=submit][value="continue"]')

  saveAndReturnButton = (): PageElement => cy.get('form button[type=submit][value="back"]')

  backToSummaryButton = (): PageElement => cy.get('a#backToSummary')

  fillInForm = (type: string): void => {
    cy.get('input[type="radio"][value="ALCOHOL_ABSTINENCE"]').check()
    cy.get('#startDate-day').type('27')
    cy.get('#startDate-month').type('3')
    cy.get('#startDate-year').type('2024')
    cy.get('#endDate-day').type('28')
    cy.get('#endDate-month').type('4')
    cy.get('#endDate-year').type('2025')

    if (type === 'probationOffice') {
      cy.get('input[type="radio"][value="PROBATION_OFFICE"]').check()
      cy.get('#probationOfficeName').type('Probation Office')
    } else if (type === 'prison') {
      cy.get('input[type="radio"][value="PRISON"]').check()
      cy.get('#prisonName').type('Prison Name')
    }
  }
}
