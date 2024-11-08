import AppPage from '../appPage'
import { PageElement } from '../page'

import paths from '../../../server/constants/paths'

export default class SubmitSuccessPage extends AppPage {
  constructor() {
    super('Application successfully submitted', paths.ORDER.SUBMIT_SUCCESS)
  }

  receiptButton = (): PageElement => cy.get('#receipt-button')

  get backToYourApplications(): PageElement {
    return cy.contains('Back to your applications')
  }
}
