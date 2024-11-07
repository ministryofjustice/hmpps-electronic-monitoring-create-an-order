import AppPage from '../appPage'

import paths from '../../../server/constants/paths'
import { PageElement } from '../page'

export default class SubmitSuccessPage extends AppPage {
  constructor() {
    super('Application successfully submitted', paths.ORDER.SUBMIT_SUCCESS)
  }

  receiptButton = (): PageElement => cy.get('#receipt-button')

  backToYourApplications = (): PageElement => cy.get('#back-to-applications-button')
}
