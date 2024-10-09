import AppPage from '../appPage'
import { PageElement } from '../page'

export default class InstallationAndRiskPage extends AppPage {
  constructor() {
    super('Installation and risk information')
  }

  form = (): PageElement => cy.get('form')

  saveAndContinueButton = (): PageElement => cy.get('form button[type=submit][value="continue"]')

  saveAndReturnButton = (): PageElement => cy.get('form button[type=submit][value="back"]')

  backToSummaryButton = (): PageElement => cy.get('a#backToSummary')
}
