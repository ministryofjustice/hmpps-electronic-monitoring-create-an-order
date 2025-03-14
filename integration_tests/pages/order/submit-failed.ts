import AppPage from '../appPage'

import paths from '../../../server/constants/paths'
import { PageElement } from '../page'

export default class SubmitFailedsPage extends AppPage {
  constructor() {
    super('Failed to submit application', paths.ORDER.SUBMIT_FAILED)
  }

  warningText = (): PageElement => cy.get('.govuk-warning-text')

  receiptButton = (): PageElement => cy.get('#receipt-button')

  backToYourApplications = (): PageElement => cy.get('#back-to-applications-button')
}
