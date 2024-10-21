import AppPage from '../appPage'
import { PageElement } from '../page'

export default class CurfewReleaseDatePage extends AppPage {
  constructor() {
    super('Monitoring conditions')
  }

  form = (): PageElement => cy.get('form')

  subHeader = (): PageElement => cy.get('h2')

  saveAndContinueButton = (): PageElement => cy.get('form button[type=submit][value="continue"]')

  saveAndReturnButton = (): PageElement => cy.get('form button[type=submit][value="back"]')

  fillInForm = (): void => {
    cy.get('#releaseDateDay').type('27')
    cy.get('#releaseDateMonth').type('3')
    cy.get('#releaseDateYear').type('2024')
    cy.get('#curfewTimes-start-hours').type('18')
    cy.get('#curfewTimes-start-minutes').type('15')
    cy.get('#curfewTimes-end-hours').type('19')
    cy.get('#curfewTimes-end-minutes').type('30')
    cy.get('input[type="radio"][value="SECONDARY"]').check()
  }
}
