import AppPage from '../appPage'

import paths from '../../../server/constants/paths'
import { PageElement } from '../page'

export default class SubmitPartialSuccessPage extends AppPage {
  constructor() {
    super('Failed to submit attachments', paths.ORDER.SUBMIT_PARTIAL_SUCCESS)
  }

  heading = (): PageElement => cy.contains('.govuk-heading-s', "If you can't open your attachments")

  receiptButton = (): PageElement => cy.get('#receipt-button')

  backToYourApplications = (): PageElement => cy.get('#back-to-applications-button')
}
