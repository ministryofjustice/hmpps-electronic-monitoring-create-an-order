import AppPage from '../appPage'
import { PageElement } from '../page'

export default class MonitoringConditionsPage extends AppPage {
  constructor() {
    super('Monitoring conditions')
  }

  form = (): PageElement => cy.get('form')

  saveAndContinueButton = (): PageElement => cy.get('form button[type=submit][value="continue"]')

  saveAndReturnButton = (): PageElement => cy.get('form button[type=submit][value="back"]')

  backToSummaryButton = (): PageElement => cy.get('a#backToSummary')

  submittedBanner = (): PageElement => cy.get('.govuk-notification-banner')
}
