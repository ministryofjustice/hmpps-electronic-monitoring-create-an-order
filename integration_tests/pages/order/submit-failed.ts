import AppPage from '../appPage'

import paths from '../../../server/constants/paths'
import { PageElement } from '../page'

export default class SubmitFailedsPage extends AppPage {
  constructor() {
    super('Failed to submit application', paths.ORDER.SUBMIT_FAILED)
  }

  heading = (): PageElement => cy.contains('.govuk-heading-s', 'You need to apply a different way')

  receiptButton = (): PageElement => cy.get('#receipt-button')

  backToYourApplications = (): PageElement => cy.get('#back-to-applications-button')
}
