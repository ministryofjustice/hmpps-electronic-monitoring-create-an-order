import AppPage from '../appPage'
import { PageElement } from '../page'

import paths from '../../../server/constants/paths'

export default class VariationSubmitSuccessPage extends AppPage {
  constructor() {
    super('Changes to the form successfully submitted', paths.ORDER.SUBMIT_SUCCESS)
  }

  receiptButton = (): PageElement => cy.get('#receipt-button')

  get backToYourApplications(): PageElement {
    return cy.contains('Back to start')
  }
}
