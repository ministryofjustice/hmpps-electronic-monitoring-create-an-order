import AppPage from '../appPage'
import { PageElement } from '../page'

export default class InstallationAndRiskPage extends AppPage {
  constructor() {
    super('Installation and risk information')
  }

  form = (): PageElement => cy.get('form')

  saveAndContinueButton = (): PageElement => cy.get('form button[type=submit][value="continue"]')

  saveAndReturnButton = (): PageElement => cy.get('form button[type=submit][value="back"]')

  fillInForm = () => {
    cy.get('select[name="offence"]').select('Robbery')
    cy.get('input[name="riskCategory[]"][value="VIOLENCE"]').click()
    cy.get('input[name="riskCategory[]"][value="GENDER"]').click()
    cy.get('input[name="riskCategory[]"][value="SUBSTANCE_ABUSE"]').click()
    cy.get('textarea[name="riskDetails"]').type('Details about the risk')
    cy.get('input[name="mappaLevel"][value="MAPPA2"]').click()
    cy.get('input[name="mappaCaseType"][value="SPECIAL_IMMIGRATION_APPEALS"]').click()
  }
}
