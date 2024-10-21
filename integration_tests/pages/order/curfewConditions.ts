import AppPage from '../appPage'
import { PageElement } from '../page'

export default class CurfewConditionsPage extends AppPage {
  constructor() {
    super('Monitoring conditions')
  }

  form = (): PageElement => cy.get('form')

  subHeader = (): PageElement => cy.get('h2')

  saveAndContinueButton = (): PageElement => cy.get('form button[type=submit][value="continue"]')

  saveAndReturnButton = (): PageElement => cy.get('form button[type=submit][value="back"]')

  fillInForm = (): void => {
    cy.get('#startDate-day').type('27')
    cy.get('#startDate-month').type('3')
    cy.get('#startDate-year').type('2025')
    cy.get('#endDate-day').type('28')
    cy.get('#endDate-month').type('4')
    cy.get('#endDate-year').type('2026')
    cy.get('input[value="SECONDARY_ADDRESS"]').check()
    cy.get('input[value="TERTIARY_ADDRESS"]').check()
  }
}
